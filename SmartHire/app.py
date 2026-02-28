import streamlit as st
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import PyPDF2

st.set_page_config(page_title="SmartHire AI", layout="wide")

st.title("🚀 SmartHire - Intelligent Job Recommendation System")

# -----------------------
# Load Dataset
# -----------------------
@st.cache_data
def load_data():
    df = pd.read_csv("jobs.csv")
    df.fillna("", inplace=True)
    return df

df = load_data()

# -----------------------
# Build TF-IDF Once
# -----------------------
@st.cache_resource
def build_model():
    vectorizer = TfidfVectorizer(stop_words="english", max_features=6000)
    tfidf_matrix = vectorizer.fit_transform(df["combined_text"])
    return vectorizer, tfidf_matrix

vectorizer, tfidf_matrix = build_model()

# -----------------------
# Resume Extractor
# -----------------------
def extract_text_from_pdf(uploaded_file):
    pdf_reader = PyPDF2.PdfReader(uploaded_file)
    text = ""
    for page in pdf_reader.pages:
        if page.extract_text():
            text += page.extract_text()
    return text

# -----------------------
# Recommendation Engine
# -----------------------
def recommend_jobs(user_text):
    user_vector = vectorizer.transform([user_text.lower()])
    similarity = cosine_similarity(user_vector, tfidf_matrix)
    scores = similarity.flatten()

    df_copy = df.copy()
    df_copy["score"] = scores
    df_copy["match_percent"] = df_copy["score"] * 100

    return df_copy.sort_values(by="score", ascending=False)

# -----------------------
# Skill Gap Analyzer
# -----------------------
def skill_gap_analysis(user_text, job_text):
    user_words = set(user_text.lower().split())
    job_words = set(job_text.lower().split())

    matched = list(user_words & job_words)
    missing = list(job_words - user_words)

    return matched[:5], missing[:5]

# -----------------------
# Sidebar Options
# -----------------------
st.sidebar.header("⚙ Recommendation Options")

mode = st.sidebar.selectbox(
    "Choose Recommendation Mode",
    ["Skill Match", "Resume Upload", "Domain Based", "Hybrid Mode"]
)

top_n = st.sidebar.slider("Number of Jobs", 3, 15, 5)

# -----------------------
# MAIN LOGIC
# -----------------------

if mode == "Skill Match":
    skills_input = st.text_area("Enter your skills (comma separated)")

    if st.button("Recommend"):
        results = recommend_jobs(skills_input)

        st.subheader("🔥 Top Matches")

        for _, row in results.head(top_n).iterrows():
            badge = "🟢 Highly Relevant" if row["match_percent"] > 70 else ""

            matched, missing = skill_gap_analysis(skills_input, row["combined_text"])

            st.markdown(f"### {row['title']} — {row['match_percent']:.2f}% Match {badge}")
            st.write(f"📍 Location: {row['location']}")
            st.write(f"🏢 Industry: {row['category']}")
            st.write(f"✅ Matched Skills: {', '.join(matched)}")
            st.write(f"❌ Missing Keywords: {', '.join(missing)}")
            st.write(row["description"][:300] + "...")
            st.markdown("---")


elif mode == "Resume Upload":
    uploaded_file = st.file_uploader("Upload Resume (PDF)")

    if uploaded_file:
        resume_text = extract_text_from_pdf(uploaded_file)
        results = recommend_jobs(resume_text)

        st.subheader("🔥 Resume Based Matches")

        for _, row in results.head(top_n).iterrows():
            badge = "🟢 Highly Relevant" if row["match_percent"] > 70 else ""
            st.markdown(f"### {row['title']} — {row['match_percent']:.2f}% Match {badge}")
            st.write(row["description"][:300] + "...")
            st.markdown("---")


elif mode == "Domain Based":
    domain_filter = st.selectbox(
        "Select Industry",
        ["All"] + list(df["category"].unique())
    )

    if domain_filter != "All":
        domain_df = df[df["category"] == domain_filter]
    else:
        domain_df = df

    st.dataframe(domain_df.head(top_n))


elif mode == "Hybrid Mode":
    skills_input = st.text_area("Enter Skills")
    uploaded_file = st.file_uploader("Upload Resume (Optional)")

    combined_text = skills_input

    if uploaded_file:
        combined_text += extract_text_from_pdf(uploaded_file)

    if st.button("Run Hybrid Recommendation"):
        results = recommend_jobs(combined_text)

        st.subheader("🔥 Hybrid Smart Matches")

        for _, row in results.head(top_n).iterrows():
            badge = "🟢 Highly Relevant" if row["match_percent"] > 70 else ""
            st.markdown(f"### {row['title']} — {row['match_percent']:.2f}% Match {badge}")
            st.write(row["description"][:300] + "...")
            st.markdown("---")
# -----------------------
# Evaluation Section
# -----------------------
st.sidebar.markdown("---")
st.sidebar.subheader("📊 Quick Model Test")

test_query = st.sidebar.text_input(
    "Test Query (for evaluation)",
    "python machine learning"
)

if st.sidebar.button("Run Precision@5 Test"):
    results = recommend_jobs(test_query).head(5)
    relevant = 0

    for _, row in results.iterrows():
        if "machine learning" in row["combined_text"]:
            relevant += 1

    precision = relevant / 5
    st.sidebar.write(f"Precision@5: {precision:.2f}")