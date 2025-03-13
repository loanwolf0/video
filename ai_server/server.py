from flask import Flask, request, send_file, jsonify
from flask_cors import CORS  
from TTS.api import TTS
import os
import time 
import torch


app = Flask(__name__)
CORS(app) 

# ✅ Create a folder to store generated audio files
SAVE_DIR = "generated_audio"
os.makedirs(SAVE_DIR, exist_ok=True)  # Creates the folder if it doesn’t exist



try:
    # Load the Coqui TTS model (XTTS v2 does not support `speakers` attribute)
    tts = TTS(model_name="tts_models/multilingual/multi-dataset/xtts_v2", progress_bar=False).to("cpu")
    

    # print(tts.speakers, ">>>>>>>>>>>>>>>>>>>>>>")
    print("✅ TTS Model loaded successfully!")
except Exception as e:
    print("❌ Error loading TTS Model:", e)
    tts = None

@app.route("/generate-tts", methods=["POST"])
def generate_tts():
    if tts is None:
        print("❌ TTS model is not loaded!")
        return jsonify({"error": "TTS model is not loaded"}), 500

    data = request.get_json()
    text = data.get("text", "No text provided")
    language = data.get("language", "hi")  # Default to English
    speaker_wav = "./sample_anurag-1.wav" 
    # speaker_wav = data.get("speaker_wav", None)  # Remove "default"
    emotion = data.get("emotion", "neutral")  # Default emotion
    output_file = "output.wav"
    
    # ✅ Generate a unique filename based on timestamp
    filename = f"{int(time.time())}.wav"
    output_path = os.path.join(SAVE_DIR, filename)


    print(f"🔹 Received text: {text}, Language: {language}, Emotion: {emotion}")

    try:
        if speaker_wav:  # Use speaker_wav only if provided
            tts.tts_to_file(
                text=text,
                file_path=output_path,
                language=language,
                speaker_wav=speaker_wav,
                # emotion=emotion
            )
        else:  # Use default voice if no speaker_wav
            tts.tts_to_file(
                text=text,
                file_path=output_file,
                language=language,
                emotion=emotion
            )

        print(f"✅ Audio file generated: {output_file}")
        return send_file(output_file, as_attachment=True)
    except Exception as e:
        print(f"❌ Error generating speech: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/")
def health_check():
    print("✅ Health check requested")
    return jsonify({"message": "TTS Server is running!"})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    print(f"🚀 Starting TTS server on port {port}...")
    app.run(host="0.0.0.0", port=port)