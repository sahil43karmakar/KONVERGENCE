"""
SmartHire AI — Flask REST API
Exposes the TF-IDF job recommendation engine for the frontend chatbot.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import os

app = Flask(__name__)
CORS(app)  # allow frontend dev server to call this API

# ── Load dataset & build model once at startup ──

CSV_PATH = os.path.join(os.path.dirname(__file__), "jobs.csv")

def load_data():
    df = pd.read_csv(CSV_PATH)
    df.fillna("", inplace=True)
    return df

df = load_data()

vectorizer = TfidfVectorizer(stop_words="english", max_features=6000)
tfidf_matrix = vectorizer.fit_transform(df["combined_text"])


# ── Recommendation logic ──

def recommend_jobs(user_text, top_n=5):
    user_vector = vectorizer.transform([user_text.lower()])
    similarity = cosine_similarity(user_vector, tfidf_matrix)
    scores = similarity.flatten()

    df_copy = df.copy()
    df_copy["score"] = scores
    df_copy["match_percent"] = df_copy["score"] * 100

    top = df_copy.sort_values(by="score", ascending=False).head(top_n)
    return top


def skill_gap_analysis(user_text, job_text):
    user_words = set(user_text.lower().split())
    job_words = set(job_text.lower().split())
    matched = list(user_words & job_words)[:5]
    missing = list(job_words - user_words)[:5]
    return matched, missing


# ── API Endpoints ──

@app.route("/api/recommend", methods=["POST"])
def api_recommend():
    data = request.get_json(force=True)
    query = data.get("query", "").strip()
    top_n = data.get("top_n", 5)

    if not query:
        return jsonify({"error": "Please provide a skill or keyword query."}), 400

    top_n = max(1, min(int(top_n), 15))
    results = recommend_jobs(query, top_n)

    output = []
    for _, row in results.iterrows():
        matched, missing = skill_gap_analysis(query, row["combined_text"])
        output.append({
            "title": row.get("title", ""),
            "location": row.get("location", ""),
            "category": row.get("category", ""),
            "match_percent": round(float(row["match_percent"]), 2),
            "description": str(row.get("description", ""))[:300],
            "matched_skills": matched,
            "missing_skills": missing,
        })

    return jsonify({"query": query, "results": output})


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "jobs_loaded": len(df)})


if __name__ == "__main__":
    print(f"✅ SmartHire API ready — {len(df)} jobs loaded")
    app.run(host="0.0.0.0", port=5000, debug=True)
