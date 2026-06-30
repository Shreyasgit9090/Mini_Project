import os
import base64
import json
import random
import time
from collections import deque
import numpy as np
import cv2
import torch
import torch.nn as nn
import torchvision.models as models
from torchvision import transforms
from flask import Flask, request, jsonify
from flask_cors import CORS

# =====================================================
# SETTINGS
# =====================================================
DEVICE = "cpu"
EMOTIONS = [
    "Angry",
    "Disgust",
    "Fear",
    "Happy",
    "Neutral",
    "Sad",
    "Surprise"
]
DB_PATH = "users_db.json"

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

# =====================================================
# DATABASE STORAGE
# =====================================================
def load_db():
    if os.path.exists(DB_PATH):
        try:
            with open(DB_PATH, "r") as f:
                return json.load(f)
        except Exception:
            pass
    return {"users": {}}

def save_db(db):
    with open(DB_PATH, "w") as f:
        json.dump(db, f, indent=4)

# =====================================================
# LOAD MODELS & PREPROCESSING
# =====================================================
print("Loading face detector cascade...")
face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)

print("Loading ConvNeXt...")
model = models.convnext_tiny(weights=None)
in_features = model.classifier[2].in_features
model.classifier[2] = nn.Sequential(
    nn.Dropout(0.5),
    nn.Linear(in_features, 7)
)
checkpoint = torch.load(
    "models/convnext_tiny_best.pth",
    map_location=DEVICE,
    weights_only=False
)
model.load_state_dict(checkpoint)
model.eval()
print("Model Loaded Successfully!")

transform = transforms.Compose([
    transforms.ToPILImage(),
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

# Default baseline loading
if os.path.exists("baseline.npy"):
    try:
        global_default_baseline = np.load("baseline.npy")
        print("Default baseline vector loaded from baseline.npy:", global_default_baseline)
    except Exception:
        global_default_baseline = np.array([1.0 / 7.0] * 7)
else:
    global_default_baseline = np.array([1.0 / 7.0] * 7)

# In-memory temporal smoothing buffers
# Maps username -> deque of arrays
temporal_buffers = {}

# Premium AI Response Messages
AI_MESSAGES = {
    "Angry": [
        "Companion detects tension. Take a deep breath. You are in control.",
        "Frustration noted. Try stepping back for a minute to reset your focus.",
        "Take a slow breath. Let's redirect this energy constructively."
    ],
    "Disgust": [
        "Companion registers a skeptical reaction. Let's pause and re-evaluate.",
        "Disapproval detected. Is there something we should adjust?",
        "Slight negative response noted. Companion is here to keep you balanced."
    ],
    "Fear": [
        "Companion sensed some apprehension. Take a steady, deep breath.",
        "Anxiety levels may be rising. Remember to ground yourself.",
        "You are doing fine. Let's slow down the pace for a moment."
    ],
    "Happy": [
        "A radiant smile detected! Keep spreading the positive energy.",
        "You look happy! Companion is pleased to share this great mood with you.",
        "Positive mindset locked in. Today is a great day!"
    ],
    "Neutral": [
        "You look calm, focused, and composed.",
        "Balanced mental state. Excellent for deep, productive work.",
        "Steady focus registered. Companion neural engine is tracking."
    ],
    "Sad": [
        "Companion detects a soft or sad expression. Remember to practice self-care.",
        "Feeling down? Take a screen break and get a refreshing drink.",
        "Companion is with you. Let's try some uplifting music to shift gears."
    ],
    "Surprise": [
        "Surprise detected! Did something catch your eye?",
        "An unexpected expression registered. Quite fascinating!",
        "Companion noticed that surprise. Keeping things interesting!"
    ]
}

# =====================================================
# REST ENDPOINTS
# =====================================================

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "healthy"}), 200

@app.route("/status", methods=["GET"])
def status():
    db = load_db()
    return jsonify({
        "status": "active",
        "registered_users": len(db["users"]),
        "model_loaded": True,
        "device": DEVICE
    }), 200

@app.route("/baseline", methods=["GET"])
def get_baseline_info():
    return jsonify({
        "default_baseline": global_default_baseline.tolist()
    }), 200

@app.route("/register", methods=["POST"])
def register():
    data = request.json or {}
    username = data.get("username", "").strip()
    password = data.get("password", "").strip()
    
    if not username or not password:
        return jsonify({"success": False, "error": "Missing fields"}), 400
        
    db = load_db()
    if username in db["users"]:
        return jsonify({"success": False, "error": "User already exists"}), 200
        
    db["users"][username] = {
        "password": password,
        "baseline": None,
        "sessions": [],
        "feedback": []
    }
    save_db(db)
    return jsonify({"success": True}), 200

@app.route("/login", methods=["POST"])
def login():
    data = request.json or {}
    username = data.get("username", "").strip()
    password = data.get("password", "").strip()
    
    db = load_db()
    user = db["users"].get(username)
    if user and user.get("password") == password:
        return jsonify({"success": True}), 200
        
    return jsonify({"success": False, "error": "Invalid credentials"}), 200

@app.route("/save_baseline", methods=["POST"])
def save_baseline():
    data = request.json or {}
    username = data.get("username", "")
    image = data.get("image")
    
    db = load_db()
    if not username or username not in db["users"]:
        return jsonify({"success": False, "error": "User not found"}), 404
        
    probs = None
    if image:
        try:
            if "," in image:
                image_data = image.split(",")[1]
            else:
                image_data = image
                
            image_bytes = base64.b64decode(image_data)
            nparr = np.frombuffer(image_bytes, np.uint8)
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            faces = face_cascade.detectMultiScale(
                gray,
                scaleFactor=1.1,
                minNeighbors=5,
                minSize=(80, 80)
            )
            
            if len(faces) > 0:
                (x, y, w, h) = faces[0]
                face = frame[y:y+h, x:x+w]
                if face.size > 0:
                    face_rgb = cv2.cvtColor(face, cv2.COLOR_BGR2RGB)
                    img_t = transform(face_rgb).unsqueeze(0)
                    with torch.no_grad():
                        logits = model(img_t)
                        probs = torch.softmax(logits, dim=1).cpu().numpy()[0]
        except Exception as e:
            print("Baseline frame prediction failed:", e)

    # Save calculated or fallback baseline
    if probs is not None:
        baseline_vector = probs.tolist()
    else:
        # Fallback to loaded baseline.npy or uniform list
        baseline_vector = global_default_baseline.tolist()
        
    db["users"][username]["baseline"] = baseline_vector
    save_db(db)
    return jsonify({"success": True, "baseline": baseline_vector}), 200

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json or {}
    image = data.get("image")
    username = data.get("username")
    sensitivity = float(data.get("sensitivity", 75))
    smoothing = float(data.get("smoothing", 60))
    
    if not image or not username:
        return jsonify({"error": "Missing parameters"}), 400
        
    db = load_db()
    user_info = db["users"].get(username)
    if not user_info:
        return jsonify({"error": "User not found"}), 404
        
    # Decode frame
    try:
        if "," in image:
            image_data = image.split(",")[1]
        else:
            image_data = image
        image_bytes = base64.b64decode(image_data)
        nparr = np.frombuffer(image_bytes, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(
            gray,
            scaleFactor=1.1,
            minNeighbors=5,
            minSize=(80, 80)
        )
    except Exception as e:
        print("Frame decoding failed:", e)
        return jsonify({
            "emotion": "Neutral",
            "confidence": 0,
            "response": "Unable to decode video frame."
        }), 200

    if len(faces) == 0:
        return jsonify({
            "emotion": "Neutral",
            "confidence": 0,
            "response": "No face detected. Adjust your camera angle or lighting."
        }), 200
        
    # Process face
    (x, y, w, h) = faces[0]
    face = frame[y:y+h, x:x+w]
    if face.size == 0:
        return jsonify({
            "emotion": "Neutral",
            "confidence": 0,
            "response": "Invalid face boundary detected."
        }), 200
        
    face_rgb = cv2.cvtColor(face, cv2.COLOR_BGR2RGB)
    img_t = transform(face_rgb).unsqueeze(0)
    
    with torch.no_grad():
        logits = model(img_t)
        raw_probs = torch.softmax(logits, dim=1).cpu().numpy()[0]
        
    # Temporal Smoothing (dynamic buffer length)
    window_len = max(1, min(10, int(smoothing / 20) + 1))
    if username not in temporal_buffers:
        temporal_buffers[username] = deque(maxlen=10)
        
    temporal_buffers[username].append(raw_probs)
    buffer_slice = list(temporal_buffers[username])[-window_len:]
    smoothed_probs = np.mean(buffer_slice, axis=0)
    
    # Baseline Calibration Adjustment
    user_baseline = user_info.get("baseline")
    if user_baseline:
        baseline = np.array(user_baseline)
    else:
        baseline = global_default_baseline
        
    # Calculate Instantaneous Emotion (from current raw probabilities)
    raw_relative_probs = raw_probs - baseline
    instant_index = np.argmax(raw_relative_probs)
    instant_emotion = EMOTIONS[instant_index]
    
    # Calculate Stable Emotion (from temporally smoothed probabilities)
    relative_probs = smoothed_probs - baseline
    stable_index = np.argmax(relative_probs)
    stable_emotion = EMOTIONS[stable_index]
    
    # Confidence represents raw model certainty in the selected stable emotion
    confidence = int(smoothed_probs[stable_index] * 100)
    
    # Select AI helper message based on stable emotion
    msg_list = AI_MESSAGES.get(stable_emotion, AI_MESSAGES["Neutral"])
    response_msg = random.choice(msg_list)
    
    # Persist session log
    session_entry = {
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "stable_emotion": stable_emotion,
        "confidence": confidence
    }
    if "sessions" not in user_info:
        user_info["sessions"] = []
    user_info["sessions"].append(session_entry)
    
    # Cap session logs at 200 to conserve storage
    if len(user_info["sessions"]) > 200:
        user_info["sessions"] = user_info["sessions"][-200:]
        
    db["users"][username] = user_info
    save_db(db)
    
    return jsonify({
        "instant_emotion": instant_emotion,
        "stable_emotion": stable_emotion,
        "emotion": stable_emotion,  # Keep for backwards compatibility
        "confidence": confidence,
        "response": response_msg
    }), 200

@app.route("/feedback", methods=["POST"])
def feedback():
    data = request.json or {}
    username = data.get("username")
    predicted = data.get("predicted")
    corrected = data.get("corrected")
    
    if not username or not corrected:
        return jsonify({"success": False, "error": "Missing parameters"}), 400
        
    db = load_db()
    user_info = db["users"].get(username)
    if not user_info:
        return jsonify({"success": False, "error": "User not found"}), 404
        
    if "feedback" not in user_info:
        user_info["feedback"] = []
        
    user_info["feedback"].append({
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "predicted": predicted,
        "corrected": corrected
    })
    
    # Correct the last recorded session so the graph visualizes the fix
    if user_info.get("sessions"):
        user_info["sessions"][-1]["stable_emotion"] = corrected
        
    db["users"][username] = user_info
    save_db(db)
    return jsonify({"success": True}), 200

@app.route("/reset/<username>", methods=["POST"])
def reset(username):
    db = load_db()
    if username in db["users"]:
        db["users"][username]["baseline"] = None
        db["users"][username]["sessions"] = []
        db["users"][username]["feedback"] = []
        save_db(db)
        if username in temporal_buffers:
            temporal_buffers[username].clear()
        return jsonify({"success": True}), 200
        
    return jsonify({"success": False, "error": "User not found"}), 404

@app.route("/analytics/<username>", methods=["GET"])
def analytics(username):
    db = load_db()
    user_info = db["users"].get(username)
    if not user_info:
        return jsonify({
            "sessions": [],
            "total_sessions": 0,
            "dominant_emotion": "Neutral",
            "average_confidence": 0
        }), 200
        
    sessions = user_info.get("sessions", [])
    total_sessions = len(sessions)
    
    if total_sessions > 0:
        confidences = [s["confidence"] for s in sessions]
        avg_confidence = int(np.mean(confidences))
        
        emotions_list = [s["stable_emotion"] for s in sessions]
        from collections import Counter
        counter = Counter(emotions_list)
        dominant_emotion = counter.most_common(1)[0][0]
    else:
        avg_confidence = 0
        dominant_emotion = "Neutral"
        
    return jsonify({
        "sessions": sessions,
        "total_sessions": total_sessions,
        "dominant_emotion": dominant_emotion,
        "average_confidence": avg_confidence
    }), 200

@app.route("/insights/<username>", methods=["GET"])
def insights(username):
    db = load_db()
    user_info = db["users"].get(username)
    if not user_info or not user_info.get("sessions"):
        return jsonify({
            "summary": "Companion neural engine is gathering information. Complete emotional companion sessions to trigger AI cognitive summaries."
        }), 200
        
    sessions = user_info.get("sessions", [])
    confidences = [s["confidence"] for s in sessions]
    avg_conf = int(np.mean(confidences))
    
    emotions_list = [s["stable_emotion"] for s in sessions]
    from collections import Counter
    counter = Counter(emotions_list)
    dom = counter.most_common(1)[0][0]
    
    summary = f"Based on your recent {len(sessions)} monitoring sessions, your emotional stability score is solid at {avg_conf}%. "
    if dom == "Happy":
        summary += "Your expressions reflect high positive states and resilience. Continue focusing on these uplifting triggers!"
    elif dom == "Sad":
        summary += "Companion has tracked regular sad or low emotional states. Ensure you schedule brief screen breaks, move around, or listen to upbeat tracks."
    elif dom == "Angry":
        summary += "Your profile points to higher spikes of stress or anger. We recommend using deep breathing exercises during work sessions."
    elif dom == "Neutral":
        summary += "You have maintained a balanced and steady state. This signals excellent composure and concentration under pressure."
    else:
        summary += f"Your dominant emotional signature is {dom}. Companion is tracking to help build self-awareness."
        
    return jsonify({"summary": summary}), 200

# Recommended extra trigger endpoints
@app.route("/start-detection", methods=["POST"])
def start_detection():
    return jsonify({"success": True, "message": "Webcam detection active."}), 200

@app.route("/stop-detection", methods=["POST"])
def stop_detection():
    return jsonify({"success": True, "message": "Webcam detection stopped."}), 200

@app.route("/collect-baseline", methods=["POST"])
def collect_baseline():
    return jsonify({"success": True, "message": "Baseline calibration session started."}), 200

# =====================================================
# START SERVER
# =====================================================
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
