from flask import Flask, request, jsonify
from flask_cors import CORS
from predictor import predict_score
from clusterer import get_cluster

app = Flask(__name__)
CORS(app)

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ML service running"})

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "No data provided"}), 400

        result = predict_score(data)
        return jsonify(result), 200

    except KeyError as e:
        return jsonify({"error": f"Missing field: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/cluster", methods=["POST"])
def cluster():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "No data provided"}), 400

        result = get_cluster(data)
        return jsonify(result), 200

    except KeyError as e:
        return jsonify({"error": f"Missing field: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)