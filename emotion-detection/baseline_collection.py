import cv2
import torch
import torch.nn as nn
import torchvision.models as models
from torchvision import transforms
import numpy as np
from collections import deque
import time

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

WINDOW_SIZE = 5
BASELINE_DURATION = 20  # seconds

probability_buffer = deque(maxlen=WINDOW_SIZE)

# =====================================================
# FACE DETECTOR
# =====================================================

face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades +
    "haarcascade_frontalface_default.xml"
)

# =====================================================
# LOAD MODEL
# =====================================================

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

print("Model Loaded!")

# =====================================================
# TRANSFORM
# =====================================================

transform = transforms.Compose([
    transforms.ToPILImage(),
    transforms.Resize((224,224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485,0.456,0.406],
        std=[0.229,0.224,0.225]
    )
])

# =====================================================
# BASELINE COLLECTION
# =====================================================

baseline_predictions = []

cap = cv2.VideoCapture(0)

print("\nSit naturally.")
print("Collecting baseline for 20 seconds...\n")

start_time = time.time()

while True:

    ret, frame = cap.read()

    if not ret:
        break

    elapsed = time.time() - start_time

    if elapsed >= BASELINE_DURATION:
        break

    gray = cv2.cvtColor(
        frame,
        cv2.COLOR_BGR2GRAY
    )

    faces = face_cascade.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=5,
        minSize=(80,80)
    )

    for (x,y,w,h) in faces:

        face = frame[y:y+h, x:x+w]

        if face.size == 0:
            continue

        face_rgb = cv2.cvtColor(
            face,
            cv2.COLOR_BGR2RGB
        )

        image = transform(face_rgb)

        image = image.unsqueeze(0)

        with torch.no_grad():

            logits = model(image)

            probs = torch.softmax(
                logits,
                dim=1
            )

            probs = probs.cpu().numpy()[0]

        probability_buffer.append(probs)

        if len(probability_buffer) == WINDOW_SIZE:

            smoothed_probs = np.mean(
                np.array(probability_buffer),
                axis=0
            )

            baseline_predictions.append(
                smoothed_probs
            )

        break

    remaining = int(
        BASELINE_DURATION - elapsed
    )

    cv2.putText(
        frame,
        f"Collecting Baseline: {remaining}s",
        (20,40),
        cv2.FONT_HERSHEY_SIMPLEX,
        1,
        (0,255,0),
        2
    )

    cv2.imshow(
        "Baseline Collection",
        frame
    )

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()

# =====================================================
# COMPUTE BASELINE
# =====================================================

baseline_predictions = np.array(
    baseline_predictions
)

baseline_vector = np.mean(
    baseline_predictions,
    axis=0
)

print("\nBaseline Vector:")
print(baseline_vector)

np.save(
    "baseline.npy",
    baseline_vector
)

print("\nSaved: baseline.npy")