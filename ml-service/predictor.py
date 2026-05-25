import pickle
import numpy as np
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")

with open(os.path.join(MODELS_DIR, "model.pkl"), "rb") as f:
    model = pickle.load(f)

with open(os.path.join(MODELS_DIR, "features.pkl"), "rb") as f:
    features = pickle.load(f)

def predict_score(data: dict) -> dict:
    # Handle missing past_score for new users
    is_estimate = False
    if data.get("past_score") is None:
        data["past_score"] = 65
        is_estimate = True

    # Build feature array in correct order
    input_data = [data[feature] for feature in features]

    # Prediction
    predicted = model.predict([input_data])[0]
    predicted = round(float(predicted), 1)

    # Clip to valid range
    predicted = max(0, min(100, predicted))

    return {
        "predicted_score": predicted,
        "is_estimate"    : is_estimate
    }