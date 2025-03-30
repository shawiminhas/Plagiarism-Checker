from flask import Flask, request, jsonify  # type: ignore
from flask_cors import CORS  # type: ignore
from dotenv import load_dotenv  # type: ignore
import os
import requests

load_dotenv()

app = Flask(__name__)
CORS(app)


@app.route("/check-plagiarism", methods=["POST"])
def check_plagiarism():
    try:
        all_content = request.get_json().get("content")
        if not all_content:
            return jsonify({"message": "Content is required"}), 400
        if len(all_content) < 200:
            return jsonify({"message": "Content length must have at least 200 characters"}), 400
        if len(all_content.split()) < 40:
            return jsonify({"message": "Content length must be at least 40 words"}), 400

        url = "https://api.gowinston.ai/v2/plagiarism"

        payload = {
            "language": "en",
            "country": "us",
            "text": all_content,
        }

        headers = {
            "Authorization": "Bearer " + os.getenv("WINSTON_API_KEY"),
            "Content-Type": "application/json",
        }

        response = requests.post(url, json=payload, headers=headers)
        return response.json()

    except Exception as e:
        return jsonify({"message": "Invalid request"}), 400


if __name__ == "__main__":
    app.run(debug=True)
