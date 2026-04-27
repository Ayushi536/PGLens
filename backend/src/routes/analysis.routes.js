const express = require('express');
const { protect, restrictTo } = require('../middleware/auth.middleware');
const { analysePGImages } = require('../services/aiAnalysisService');
const { pool } = require('../config/db');

const router = express.Router();

// POST /api/analysis/pg/:pg_id
// Triggers AI analysis — called automatically after image upload completes
router.post('/pg/:pg_id', protect, restrictTo('owner'), async (req, res) => {
  const pg_id    = parseInt(req.params.pg_id);
  const owner_id = req.user.id;

  // Verify ownership
  const pgCheck = await pool.query(
    'SELECT id FROM pgs WHERE id = $1 AND owner_id = $2',
    [pg_id, owner_id]
  );
  if (pgCheck.rows.length === 0) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  // Respond immediately — analysis runs in background
  res.status(202).json({ message: 'Analysis started. Results will be ready shortly.' });

  // Run async — don't await
  analysePGImages(pg_id).catch(err =>
    console.error(`[AI] Background analysis error for PG ${pg_id}:`, err.message)
  );
});

// GET /api/analysis/pg/:pg_id
// Get analysis results — public (students can see trust scores)
router.get('/pg/:pg_id', async (req, res) => {
  try {
    const { pg_id } = req.params;

    const result = await pool.query(
      `SELECT ai_analysis_status, ai_analysed_at, ai_hygiene_score,
              ai_amenity_score, ai_trust_score, ai_flags,
              ai_amenity_matches, ai_cleanliness_note,
              has_wifi, has_ac, has_meals, has_laundry, has_parking,
              has_security, has_gym, has_hot_water, has_tv
       FROM pgs WHERE id = $1`,
      [pg_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'PG not found' });
    }

    const pg = result.rows[0];

    res.json({
      status:           pg.ai_analysis_status,
      analysed_at:      pg.ai_analysed_at,
      hygiene_score:    pg.ai_hygiene_score,
      amenity_score:    pg.ai_amenity_score,
      trust_score:      pg.ai_trust_score,
      flags:            pg.ai_flags || [],
      amenity_matches:  pg.ai_amenity_matches || {},
      cleanliness_note: pg.ai_cleanliness_note,
      claimed_amenities: {
        has_wifi:      pg.has_wifi,
        has_ac:        pg.has_ac,
        has_meals:     pg.has_meals,
        has_laundry:   pg.has_laundry,
        has_parking:   pg.has_parking,
        has_security:  pg.has_security,
        has_gym:       pg.has_gym,
        has_hot_water: pg.has_hot_water,
        has_tv:        pg.has_tv,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch analysis' });
  }
});

module.exports = router;