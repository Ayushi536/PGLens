const { pool } = require('../config/db');

const NLP_SERVICE_URL = process.env.NLP_SERVICE_URL || 'http://localhost:5001';

const AMENITY_LABELS = {
  has_ac:        'Air Conditioning',
  has_tv:        'Television',
  has_wifi:      'WiFi Router',
  has_laundry:   'Washing Machine',
  has_parking:   'Parking Area',
  has_security:  'Security Camera',
  has_gym:       'Gym Equipment',
  has_hot_water: 'Hot Water Geyser',
  has_meals:     'Meals / Kitchen',
};

async function analysePGImages(pgId) {
  console.log(`[AI] Starting image analysis for PG ${pgId}`);

  await pool.query(
    `UPDATE pgs SET ai_analysis_status = 'processing' WHERE id = $1`,
    [pgId]
  );

  try {
    // Fetch claimed amenities from DB
    const pgResult = await pool.query(
      `SELECT has_wifi, has_ac, has_meals, has_laundry, has_parking,
              has_security, has_gym, has_hot_water, has_tv
       FROM pgs WHERE id = $1`,
      [pgId]
    );
    if (pgResult.rows.length === 0) throw new Error('PG not found');
    const claimedAmenities = pgResult.rows[0];

    // Fetch all images grouped by category
    const imagesResult = await pool.query(
      `SELECT category, image_url FROM pg_images
       WHERE pg_id = $1 ORDER BY category, uploaded_at ASC`,
      [pgId]
    );

    // Group URLs by category
    const imagesByCategory = {};
    for (const row of imagesResult.rows) {
      if (!imagesByCategory[row.category]) imagesByCategory[row.category] = [];
      imagesByCategory[row.category].push(row.image_url);
    }

    if (Object.keys(imagesByCategory).length === 0) {
      throw new Error('No images found for this PG');
    }

    // Call Flask vision service
    const response = await fetch(`${NLP_SERVICE_URL}/analyse-images`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        pg_id:             pgId,
        claimed_amenities: claimedAmenities,
        images:            imagesByCategory,
      }),
      signal: AbortSignal.timeout(120000), // 2 min timeout — CLIP is slow on CPU
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Vision service responded with error: ${errText}`);
    }

    const result = await response.json();

    // Save all results to pgs table
    await pool.query(
      `UPDATE pgs SET
        ai_analysis_status  = 'completed',
        ai_analysed_at      = NOW(),
        ai_hygiene_score    = $2,
        ai_amenity_score    = $3,
        ai_trust_score      = $4,
        ai_flags            = $5,
        ai_amenity_matches  = $6,
        ai_cleanliness_note = $7
       WHERE id = $1`,
      [
        pgId,
        result.hygiene_score,
        result.amenity_score,
        result.trust_score,
        JSON.stringify(result.flags        || []),
        JSON.stringify(result.amenity_matches || {}),
        result.cleanliness_note,
      ]
    );

    console.log(
      `[AI] Done for PG ${pgId}:`,
      `hygiene=${result.hygiene_score}`,
      `amenity=${result.amenity_score}`,
      `trust=${result.trust_score}`
    );

    return result;

  } catch (err) {
    console.error(`[AI] Analysis failed for PG ${pgId}:`, err.message);
    await pool.query(
      `UPDATE pgs SET ai_analysis_status = 'failed' WHERE id = $1`,
      [pgId]
    );
    throw err;
  }
}

module.exports = { analysePGImages };