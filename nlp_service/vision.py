"""
PGLens Vision Analysis Module
Handles image-based amenity detection and cleanliness scoring using CLIP.
This is a Flask Blueprint — registered in app.py with two lines.
Author: [your name]
"""

from flask import Blueprint, request, jsonify
import requests as req
from PIL import Image
from io import BytesIO
import numpy as np

vision_bp = Blueprint('vision', __name__)

# ─── Lazy-load CLIP ───────────────────────────────────────────────────────────
_clip_model     = None
_clip_processor = None

def get_clip():
    global _clip_model, _clip_processor
    if _clip_model is None:
        print("⏳ Loading CLIP model (first time only, ~600MB)...")
        from transformers import CLIPProcessor, CLIPModel
        _clip_model     = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
        _clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
        _clip_model.eval()
        print("✅ CLIP model loaded successfully")
    return _clip_model, _clip_processor


# ─── Amenity detection prompts ────────────────────────────────────────────────
# For each amenity, defines which image category to check
# and what positive/negative text prompts to use with CLIP
AMENITY_PROMPTS = {
    "has_ac": {
        "bedroom": {
            "positive": [
                "an air conditioner unit mounted on wall",
                "split AC unit in bedroom",
                "air conditioning unit on wall"
            ],
            "negative": [
                "a room with no air conditioner",
                "bedroom without AC unit"
            ]
        }
    },
    "has_tv": {
        "bedroom": {
            "positive": [
                "a television mounted on wall",
                "flat screen TV in bedroom",
                "television set in room"
            ],
            "negative": [
                "a bedroom without television",
                "no TV in room"
            ]
        }
    },
    "has_wifi": {
        "bedroom": {
            "positive": [
                "a wifi router on shelf or table",
                "wireless internet router device",
                "network router in room"
            ],
            "negative": [
                "no wifi router visible in room",
                "room without internet equipment"
            ]
        },
        "hallway": {
            "positive": [
                "a wifi router mounted on wall",
                "network equipment in corridor"
            ],
            "negative": [
                "hallway with no network equipment"
            ]
        }
    },
    "has_hot_water": {
        "washroom": {
            "positive": [
                "a geyser water heater mounted on wall",
                "electric water heater in bathroom",
                "hot water geyser in washroom"
            ],
            "negative": [
                "bathroom without water heater",
                "no geyser in washroom"
            ]
        }
    },
    "has_security": {
        "hallway": {
            "positive": [
                "a CCTV security camera on ceiling",
                "surveillance camera in corridor",
                "security camera mounted on wall"
            ],
            "negative": [
                "hallway without security camera",
                "no CCTV camera visible"
            ]
        },
        "outside": {
            "positive": [
                "CCTV camera on building exterior",
                "security camera outside building"
            ],
            "negative": [
                "building without security camera"
            ]
        }
    },
    "has_parking": {
        "outside": {
            "positive": [
                "a parking area with vehicles parked",
                "parking space outside building",
                "cars parked in front of building"
            ],
            "negative": [
                "no parking area visible",
                "building without parking space"
            ]
        }
    },
    "has_gym": {
        "outside": {
            "positive": [
                "gym equipment and exercise machines",
                "fitness equipment in a gym room",
                "treadmill and weights in gym"
            ],
            "negative": [
                "no gym equipment visible",
                "empty room without exercise equipment"
            ]
        }
    },
    "has_laundry": {
        "outside": {
            "positive": [
                "a washing machine in laundry area",
                "clothes washing machine",
                "laundry area with washing machine"
            ],
            "negative": [
                "no washing machine visible",
                "no laundry equipment"
            ]
        },
        "hallway": {
            "positive": [
                "a washing machine in corridor",
                "laundry machine in hallway"
            ],
            "negative": [
                "no laundry equipment in hallway"
            ]
        }
    }
}

# Amenities that can't be detected from images — skip silently
NOT_DETECTABLE = ["has_meals"]

# Cleanliness prompts per image category
CLEANLINESS_PROMPTS = {
    "bedroom": {
        "clean": [
            "a very clean and tidy bedroom with organised furniture",
            "well maintained neat bedroom with clean floors and walls",
            "spotless room with no clutter or dirt"
        ],
        "dirty": [
            "a dirty and messy bedroom with clutter everywhere",
            "untidy room with dust stains and garbage",
            "filthy room with dirty floors and walls"
        ]
    },
    "washroom": {
        "clean": [
            "a very clean bathroom with no stains or mold",
            "spotless washroom with clean tiles and fixtures",
            "hygienic bathroom with clean toilet and sink"
        ],
        "dirty": [
            "a dirty bathroom with stains and mold on tiles",
            "unhygienic washroom with grime and dirt",
            "filthy toilet and bathroom with stains"
        ]
    },
    "hallway": {
        "clean": [
            "a clean well lit corridor with no clutter",
            "tidy hallway with clean floors"
        ],
        "dirty": [
            "a dirty cluttered hallway with garbage",
            "messy corridor with dirt and clutter"
        ]
    },
    "outside": {
        "clean": [
            "a well maintained clean building exterior",
            "clean surroundings outside building with no garbage"
        ],
        "dirty": [
            "a poorly maintained building exterior with garbage",
            "dirty surroundings outside building"
        ]
    }
}

AMENITY_LABELS = {
    "has_ac":        "Air Conditioning",
    "has_tv":        "Television",
    "has_wifi":      "WiFi Router",
    "has_laundry":   "Washing Machine",
    "has_parking":   "Parking Area",
    "has_security":  "Security Camera",
    "has_gym":       "Gym Equipment",
    "has_hot_water": "Hot Water Geyser",
    "has_meals":     "Meals / Kitchen",
}


# ─── Core CLIP helpers ────────────────────────────────────────────────────────

def load_image_from_url(url):
    """Download image from Cloudinary URL and return PIL Image"""
    response = req.get(url, timeout=15)
    response.raise_for_status()
    return Image.open(BytesIO(response.content)).convert("RGB")


def clip_score(image, text_prompts):
    """
    Run CLIP on one image against multiple text prompts.
    Returns softmax probabilities — higher = better match.
    """
    import torch
    model, processor = get_clip()
    inputs = processor(
        text=text_prompts,
        images=image,
        return_tensors="pt",
        padding=True,
        truncation=True
    )
    with torch.no_grad():
        outputs = model(**inputs)
        logits  = outputs.logits_per_image   # [1, num_texts]
        probs   = logits.softmax(dim=1)
    return probs[0].tolist()


def score_cleanliness(image, category):
    """
    Returns cleanliness score 0–100 for a single image.
    100 = very clean, 0 = very dirty.
    """
    cfg = CLEANLINESS_PROMPTS.get(category, CLEANLINESS_PROMPTS["bedroom"])
    clean_prompts = cfg["clean"]
    dirty_prompts = cfg["dirty"]
    all_prompts   = clean_prompts + dirty_prompts

    probs       = clip_score(image, all_prompts)
    clean_score = sum(probs[:len(clean_prompts)])
    dirty_score = sum(probs[len(clean_prompts):])
    total       = clean_score + dirty_score

    if total == 0:
        return 50

    return int((clean_score / total) * 100)


def detect_amenity_in_image(image, amenity_key, category):
    """
    Checks if a specific amenity is visible in the image.
    Returns (detected: bool | None, confidence: float)
    None = not detectable in this category.
    """
    cfg = AMENITY_PROMPTS.get(amenity_key, {}).get(category)
    if not cfg:
        return None, 0.0

    positive_prompts = cfg["positive"]
    negative_prompts = cfg["negative"]
    all_prompts      = positive_prompts + negative_prompts

    probs     = clip_score(image, all_prompts)
    pos_score = sum(probs[:len(positive_prompts)])
    neg_score = sum(probs[len(positive_prompts):])
    total     = pos_score + neg_score

    confidence = pos_score / total if total > 0 else 0.5
    detected   = confidence >= 0.55  # tunable threshold

    return detected, round(confidence, 3)


def flag_image(image):
    """
    Detect suspicious image qualities.
    Returns list of flag strings.
    """
    flags = []

    # Check brightness — very dark images are suspicious
    img_array   = np.array(image)
    mean_bright = img_array.mean()
    if mean_bright < 40:
        flags.append("Image is very dark — poor visibility")

    # Check if it looks like a stock photo
    stock_prompts = [
        "a professional stock photo of a perfectly staged room",
        "a real photo taken inside an Indian PG accommodation"
    ]
    probs = clip_score(image, stock_prompts)
    if probs[0] > 0.78:
        flags.append("Image may be a stock photo — not a real PG room")

    return flags


# ─── Routes ───────────────────────────────────────────────────────────────────

@vision_bp.route('/analyse-images/health', methods=['GET'])
def vision_health():
    """Warm up CLIP and confirm it loads. Call this once after deployment."""
    try:
        get_clip()
        return jsonify({"status": "CLIP model loaded ✅", "ready": True})
    except Exception as e:
        return jsonify({"status": f"CLIP load failed: {str(e)}", "ready": False}), 500


@vision_bp.route('/analyse-images', methods=['POST'])
def analyse_images():
    """
    Full image analysis for a PG listing.

    Request JSON:
    {
      "pg_id": 1,
      "claimed_amenities": {
        "has_ac": true, "has_tv": false, "has_wifi": true,
        "has_hot_water": true, "has_security": false,
        "has_parking": false, "has_gym": false,
        "has_laundry": true, "has_meals": false
      },
      "images": {
        "bedroom":  ["https://res.cloudinary.com/...jpg", "..."],
        "washroom": ["https://res.cloudinary.com/...jpg"],
        "hallway":  ["https://res.cloudinary.com/...jpg"],
        "outside":  ["https://res.cloudinary.com/...jpg"]
      }
    }

    Response JSON:
    {
      "hygiene_score": 78,
      "amenity_score": 85,
      "trust_score": 80,
      "cleanliness_note": "Bedroom appears clean and well organised.",
      "amenity_matches": { "has_ac": true, "has_wifi": false },
      "flags": ["Claimed WiFi Router but not visible in uploaded images"],
      "category_scores": { "bedroom": 82, "washroom": 74 }
    }
    """
    data = request.get_json()
    if not data:
        return jsonify({"error": "No JSON body provided"}), 400

    claimed_amenities  = data.get("claimed_amenities", {})
    images_by_category = data.get("images", {})

    if not images_by_category:
        return jsonify({"error": "No images provided"}), 400

    category_cleanliness = {}   # { category: avg_score }
    amenity_detections   = {}   # { amenity_key: { detected, confidence } }
    all_flags            = []

    # ── Process each category ─────────────────────────────────────────────────
    for category, urls in images_by_category.items():
        if not urls:
            continue

        cat_clean_scores = []

        for url in urls:
            try:
                image = load_image_from_url(url)

                # 1. Cleanliness score
                clean_score = score_cleanliness(image, category)
                cat_clean_scores.append(clean_score)

                # 2. Flag suspicious images
                img_flags = flag_image(image)
                all_flags.extend(img_flags)

                # 3. Amenity detection for claimed amenities only
                for amenity_key, is_claimed in claimed_amenities.items():
                    if not is_claimed:
                        continue
                    if amenity_key in NOT_DETECTABLE:
                        continue

                    detected, confidence = detect_amenity_in_image(
                        image, amenity_key, category
                    )
                    if detected is None:
                        continue  # Not checkable in this category

                    # Keep the best detection result across all images
                    existing = amenity_detections.get(amenity_key)
                    if existing is None or confidence > existing["confidence"]:
                        amenity_detections[amenity_key] = {
                            "detected":   detected,
                            "confidence": confidence,
                        }

            except Exception as e:
                print(f"[Vision] Error processing image {url}: {e}")
                all_flags.append(f"Could not process one {category} image")
                continue

        if cat_clean_scores:
            category_cleanliness[category] = round(
                sum(cat_clean_scores) / len(cat_clean_scores)
            )

    # ── Hygiene score: bedroom 60% + washroom 40% ────────────────────────────
    bedroom_clean  = category_cleanliness.get("bedroom",  50)
    washroom_clean = category_cleanliness.get("washroom", 50)
    hygiene_score  = round(bedroom_clean * 0.6 + washroom_clean * 0.4)

    # ── Cleanliness note ──────────────────────────────────────────────────────
    if bedroom_clean >= 75:
        cleanliness_note = "Bedroom appears clean and well maintained."
    elif bedroom_clean >= 50:
        cleanliness_note = "Bedroom looks reasonably clean with some areas to improve."
    else:
        cleanliness_note = "Bedroom shows signs of poor cleanliness in the uploaded images."

    # ── Amenity score ─────────────────────────────────────────────────────────
    amenity_matches    = {k: v["detected"] for k, v in amenity_detections.items()}
    detectable_claimed = [
        k for k, v in claimed_amenities.items()
        if v and k in AMENITY_PROMPTS
    ]
    verified_count = sum(
        1 for k in detectable_claimed
        if amenity_matches.get(k) is True
    )
    amenity_score = (
        round((verified_count / len(detectable_claimed)) * 100)
        if detectable_claimed else 100
    )

    # ── Mismatch flags ────────────────────────────────────────────────────────
    for k in detectable_claimed:
        if amenity_matches.get(k) is False:
            label = AMENITY_LABELS.get(k, k)
            all_flags.append(
                f"Claimed '{label}' but not visible in uploaded images"
            )

    # ── Trust score ───────────────────────────────────────────────────────────
    mismatch_count   = sum(
        1 for k in detectable_claimed if amenity_matches.get(k) is False
    )
    stock_flags      = [f for f in all_flags if "stock photo" in f.lower()]
    mismatch_penalty = mismatch_count * 15
    stock_penalty    = min(len(stock_flags) * 20, 40)
    trust_score      = max(0, 100 - mismatch_penalty - stock_penalty)

    return jsonify({
        "hygiene_score":    hygiene_score,
        "amenity_score":    amenity_score,
        "trust_score":      trust_score,
        "cleanliness_note": cleanliness_note,
        "amenity_matches":  amenity_matches,
        "flags":            list(set(all_flags)),
        "category_scores":  category_cleanliness,
    })