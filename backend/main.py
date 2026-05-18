from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import google.generativeai as genai
import base64
import os
from datetime import datetime
from PIL import Image

# Load environment variables
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("❌ Missing GEMINI_API_KEY in .env file")

genai.configure(api_key=api_key)

app = Flask(__name__)
CORS(app)

model_flash = genai.GenerativeModel("gemini-2.0-flash")
model_tts = genai.GenerativeModel("gemini-2.0-flash-lite-tts")


# -------------------------------------------------------
# 1) TEXT CHAT
# -------------------------------------------------------
@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "")

    prompt = f"""
    You are Fitmeal AI, a friendly nutrition assistant.
    Provide short, helpful, evidence-based nutrition guidance.

    User: {user_message}
    """

    response = model_flash.generate_content(prompt)
    reply = response.text if response else "Error."

    return jsonify({"reply": reply})


# -------------------------------------------------------
# 2) IMAGE CALORIE ESTIMATION
# -------------------------------------------------------
@app.route("/analyze-image", methods=["POST"])
def analyze_image():
    file = request.files.get("image")
    if not file:
        return jsonify({"error": "No image uploaded"})

    img = Image.open(file.stream)

    response = model_flash.generate_content([
        "Identify all food items in the image and estimate calories. Format: Item - Calories.",
        img
    ])

    return jsonify({"calories": response.text})


# -------------------------------------------------------
# 3) SAVE DAILY CALORIES (Local File)
# -------------------------------------------------------
@app.route("/save-daily", methods=["POST"])
def save_daily():
    data = request.get_json()
    calories = data.get("calories", "")
    goal = data.get("goal", "")

    today = datetime.now().strftime("%Y-%m-%d")
    entry = f"{today} | Calories: {calories} | Goal: {goal}\n"

    with open("daily_log.txt", "a") as f:
        f.write(entry)

    return jsonify({"status": "saved"})


# -------------------------------------------------------
# 4) TEXT TO SPEECH (TTS)
# -------------------------------------------------------
@app.route("/tts", methods=["POST"])
def tts():
    data = request.get_json()
    text = data.get("text", "")

    response = model_tts.generate_content(
        text,
        generation_config={"response_mime_type": "audio/mp3"}
    )

    audio_bytes = response.audio
    audio_b64 = base64.b64encode(audio_bytes).decode()

    return jsonify({"audio_base64": audio_b64})


# -------------------------------------------------------
# 5) VOICE → TEXT (STT)
# -------------------------------------------------------
@app.route("/stt", methods=["POST"])
def stt():
    file = request.files.get("audio")
    if not file:
        return jsonify({"error": "No audio uploaded"})

    audio_bytes = file.read()

    response = model_flash.generate_content([
        "Transcribe this audio accurately:",
        {
            "mime_type": "audio/mp3",
            "data": audio_bytes
        }
    ])

    return jsonify({"text": response.text})


# -------------------------------------------------------
if __name__ == "__main__":
    app.run(port=5000, debug=True)
