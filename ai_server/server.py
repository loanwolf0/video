# from flask import Flask, request, send_file, jsonify
# from flask_cors import CORS  
# from TTS.api import TTS
# import os
# import time 
# import torch
# from pydub import AudioSegment


# app = Flask(__name__)
# CORS(app) 

# # ✅ Create a folder to store generated audio files
# SAVE_DIR = "generated_audio"
# os.makedirs(SAVE_DIR, exist_ok=True)  # Creates the folder if it doesn’t exist



# try:
#     # Load the Coqui TTS model (XTTS v2 does not support `speakers` attribute)
#     tts = TTS(model_name="tts_models/multilingual/multi-dataset/xtts_v2", progress_bar=False).to("cpu")
    

#     # print(tts.speakers, ">>>>>>>>>>>>>>>>>>>>>>")
#     print("✅ TTS Model loaded successfully!")
# except Exception as e:
#     print("❌ Error loading TTS Model:", e)
#     tts = None

# # @app.route("/generate-tts", methods=["POST"])
# # def generate_tts():
# #     if tts is None:
# #         print("❌ TTS model is not loaded!")
# #         return jsonify({"error": "TTS model is not loaded"}), 500

# #     data = request.get_json()
# #     text = data.get("text", "No text provided")
# #     language = data.get("language", "hi")  # Default to English
# #     speaker_wav = "./sample_anurag-2.wav" 
# #     # speaker_wav = data.get("speaker_wav", None)  # Remove "default"
# #     emotion = data.get("emotion", "neutral")  # Default emotion
# #     output_file = "output.wav"
    
# #     # ✅ Generate a unique filename based on timestamp
# #     filename = f"{int(time.time())}.wav"
# #     output_path = os.path.join(SAVE_DIR, filename)


# #     print(f"🔹 Received text: {text}, Language: {language},")

# #     try:
# #         if speaker_wav:  # Use speaker_wav only if provided
# #             tts.tts_to_file(
# #                 text=text,
# #                 file_path=output_path,
# #                 language=language,
# #                 speaker_wav=speaker_wav,
# #                 # emotion=emotion
# #             )
# #         else:  # Use default voice if no speaker_wav
# #             tts.tts_to_file(
# #                 text=text,
# #                 file_path=output_file,
# #                 language=language,
# #                 emotion=emotion
# #             )

# #         print(f"✅ Audio file generated: {output_file}")
# #         return send_file(output_file, as_attachment=True)
# #     except Exception as e:
# #         print(f"❌ Error generating speech: {e}")
# #         return jsonify({"error": str(e)}), 500



# @app.route("/generate-tts", methods=["POST"])
# def generate_tts():
#     if tts is None:
#         return jsonify({"error": "TTS model is not loaded"}), 500

#     data = request.get_json()
#     text = data.get("text", "No text provided")
#     emotion="calm"
#     language = data.get("language", "hi")
#     speaker_wav = "./sample_anurag-2.wav"
#     speed=0.85,
#     output_file = os.path.join(SAVE_DIR, f"{int(time.time())}.wav")

#     print(f"🔹 Received text: {text}, Language: {language}")

#     try:
#         # ✅ Generate the WAV file
#         tts.tts_to_file(text=text, file_path=output_file,emotion=emotion, speed=speed, language=language, speaker_wav=speaker_wav)


#         # ✅ Check file size after generation
#         file_size = os.path.getsize(output_file)
#         if file_size == 0:
#             print("❌ Error: Generated file is empty!")
#             return jsonify({"error": "Generated audio file is empty"}), 500

#         print(f"✅ Audio file generated: {output_file}, Size: {file_size} bytes")
        
#         return send_file(output_file, mimetype="audio/wav", as_attachment=True)

#     except Exception as e:
#         print(f"❌ Error generating speech: {e}")
#         return jsonify({"error": str(e)}), 500





# @app.route("/")
# def health_check():
#     print("✅ Health check requested")
#     return jsonify({"message": "TTS Server is running!"})

# if __name__ == "__main__":
#     port = int(os.environ.get("PORT", 8000))
#     print(f"🚀 Starting TTS server on port {port}...")
#     app.run(host="0.0.0.0", port=port)



from flask import Flask, request, send_file, jsonify
from flask_cors import CORS  
from TTS.api import TTS
import os
import time 
import torch
from pydub import AudioSegment

app = Flask(__name__)
CORS(app) 

# ✅ Create a folder to store generated audio files
SAVE_DIR = "generated_audio"
os.makedirs(SAVE_DIR, exist_ok=True)  # Creates the folder if it doesn’t exist

try:
    # Load the Coqui TTS model (XTTS v2 does not support `speakers` attribute)
    tts = TTS(model_name="tts_models/multilingual/multi-dataset/xtts_v2", progress_bar=False).to("cpu")
    print("✅ TTS Model loaded successfully!")
except Exception as e:
    print("❌ Error loading TTS Model:", e)
    tts = None

@app.route("/generate-tts", methods=["POST"])
def generate_tts():
    if tts is None:
        return jsonify({"error": "TTS model is not loaded"}), 500

    data = request.get_json()
    text = data.get("text", "No text provided")
    emotion = "happy"
    language = data.get("language", "hi")
    speaker_wav = "./sample_anurag-1.wav"
    speed = 0.8
    output_file = os.path.join(SAVE_DIR, f"{int(time.time())}.wav")
    enhanced_file = os.path.join(SAVE_DIR, f"{int(time.time())}_enhanced.wav")

    print(f"🔹 Received text: {text}, Language: {language}")

    try:
        # ✅ Generate the WAV file
        tts.tts_to_file(text=text, file_path=output_file, emotion=emotion, speed=speed, language=language, speaker_wav=speaker_wav)

        # ✅ Check file size after generation
        file_size = os.path.getsize(output_file)
        if file_size == 0:
            print("❌ Error: Generated file is empty!")
            return jsonify({"error": "Generated audio file is empty"}), 500

        print(f"✅ Audio file generated: {output_file}, Size: {file_size} bytes")

        # ✅ Apply enhancements
        audio = AudioSegment.from_wav(output_file)
        audio = audio.normalize()  # Adjusts volume
        audio = audio.low_pass_filter(3000)  # Reduces harshness
        # ✅ High-pass filter (removes deep hums, makes voice clearer)
        audio = audio.high_pass_filter(150)

        # ✅ Light Reverb Effect (adds natural resonance)
        audio = audio + 2  # Increase overall volume slightly
        audio = audio.fade_in(300).fade_out(300)  # Smooth start and end
        audio.export(enhanced_file, format="wav")

        print(f"✅ Enhanced audio saved: {enhanced_file}")

        return send_file(enhanced_file, mimetype="audio/wav", as_attachment=True)

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
