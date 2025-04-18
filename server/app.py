from flask import Flask, request, jsonify, send_file, after_this_request  # type: ignore
from flask_cors import CORS  # type: ignore
from dotenv import load_dotenv  # type: ignore
from pymongo import MongoClient  # type: ignore
from pymongo.errors import ConnectionFailure  # type: ignore
import os
from utils.mongo_utils import save_file_to_mongo  # type: ignore
from utils.pdf_generator import generate_pdf  # type: ignore
import requests


load_dotenv()

app = Flask(__name__)

try:
    client = MongoClient(os.getenv("MONGODB_URI"))
    client.admin.command("ping")
    print("MongoDB connection successful")
except ConnectionFailure:
    print("MongoDB connection failed")
    exit(1)

db = client["plagiarism_checker"]
CORS(app)


@app.route("/check-plagiarism", methods=["POST"])
def check_plagiarism():
    """
    Checks for plagiarism.

    This route accepts json payload containing content to analyze for plagiarism.
    Content must be at least 200 characters and 40 words.

    Request Body (PDF file):
        {
            "content": "Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        }

    Response (PDF file):
        A PDF file containing the plagiarism analysis report.

    Response (JSON - Error):
        {
            "message": "Error message describing the issue."
        }

    Status Codes:
        200 (OK): plagiarism report PDF successfully generated and sent as file attachment.
        400 (Bad Request): Invalid request data. Examples:
            - {"message": "Content is required"}
            - {"message": "Content length must have at least 200 characters"}
            - {"message": "Content length must be at least 40 words"}
        500 (Internal Server Error): An error occurred which was unable to generated response PDF.
            - {"message": "Unable to generate file"}

    """
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

        if response.status_code != 200:
            return jsonify({"message": "Unable to generate file"}), 500
        data = response.json()

        if not data:
            return jsonify({"message": "Unable to generate file"}), 500
        pdf_path = generate_pdf(all_content, data)

        if not os.path.exists(pdf_path):
            return jsonify({"message": "Unable to generate file"}), 500

        file_id = save_file_to_mongo(pdf_path, db)
        if not file_id:
            return jsonify({"message": "Unable to generate file"}), 500

        @after_this_request
        def remove_pdf(response):
            try:
                if os.path.exists(pdf_path):
                    os.remove(pdf_path)
                    print(f"File '{pdf_path}' deleted successfully.")
            except Exception as e:
                print(f"Error deleting file '{pdf_path}': {e}")
            return response

        return send_file(pdf_path, as_attachment=True, mimetype="application/pdf")

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"message": "Unable to generate file"}), 500


if __name__ == "__main__":
    app.run(debug=True)
