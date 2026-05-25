import pickle
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")

with open(os.path.join(MODELS_DIR, "kmeans_model.pkl"), "rb") as f:
    kmeans = pickle.load(f)

with open(os.path.join(MODELS_DIR, "cluster_scaler.pkl"), "rb") as f:
    scaler = pickle.load(f)

with open(os.path.join(MODELS_DIR, "cluster_names.pkl"), "rb") as f:
    cluster_names = pickle.load(f)

RECOMMENDATIONS = {
    "Consistent Learner": [
        "Excellent study habits — maintain your routine",
        "Try teaching concepts to others to deepen understanding",
        "Challenge yourself with harder practice questions"
    ],
    "Passive Learner": [
        "Try increasing study hours by 1 hour daily",
        "Improve attendance",
        "Set a fixed daily study schedule and stick to it"
    ],
    "Burnout Risk": [
        "Prioritize sleep — aim for at least 7 hours",
        "Take structured breaks using Pomodoro technique",
        "Break study sessions into smaller chunks to reduce stress"
    ]
}
#We haven't imported cluster features because it includes past_scores which is not required for clustering and it is not used in the model. 
CLUSTER_FEATURES = [
    "study_hours",
    "sleep_hours",
    "breaks_taken",
    "attendance"
]

def get_cluster(data: dict) -> dict:
    # Build feature array in correct order
    input_data = [[data[f] for f in CLUSTER_FEATURES]]

    # Scale the input
    input_scaled = scaler.transform(input_data)

    # Predict cluster
    cluster_id = int(kmeans.predict(input_scaled)[0])
    label = cluster_names[cluster_id]

    return {
        "cluster"        : cluster_id,
        "cluster_label"  : label,
        "recommendations": RECOMMENDATIONS[label]
    }