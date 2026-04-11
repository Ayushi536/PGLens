"""
Run this ONCE to analyse all existing reviews that don't have NLP data yet.
Usage: python backfill.py
"""
import requests
import psycopg2
import json

DB_URL = "postgresql://postgres:MKOLPNJIBHU2345@db.xzctlghaytcryisuqcqv.supabase.co:5432/postgres"
NLP_URL = "http://localhost:5001"

conn = psycopg2.connect(DB_URL)
cur = conn.cursor()

# Get all reviews without NLP analysis
cur.execute("SELECT id, review_text FROM reviews WHERE nlp_analysed = FALSE AND review_text IS NOT NULL")
reviews = cur.fetchall()

print(f"Found {len(reviews)} reviews to analyse...")

for review_id, text in reviews:
    if not text or len(text.strip()) < 5:
        continue
    
    try:
        resp = requests.post(f"{NLP_URL}/analyse", json={"text": text}, timeout=10)
        data = resp.json()
        
        cur.execute("""
            UPDATE reviews SET
                sentiment = %s,
                sentiment_score = %s,
                nlp_keywords = %s,
                nlp_topics = %s,
                nlp_analysed = TRUE
            WHERE id = %s
        """, (
            data['sentiment'],
            data['sentiment_score'],
            data['keywords'],
            data['topics'],
            review_id
        ))
        conn.commit()
        print(f"✅ Review {review_id}: {data['sentiment']} ({data['sentiment_score']})")
    
    except Exception as e:
        print(f"❌ Review {review_id} failed: {e}")

cur.close()
conn.close()
print("Done!")