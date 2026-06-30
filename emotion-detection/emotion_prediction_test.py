import cv2
import torch
import torch.nn as nn
import torchvision.models as models
from torchvision import transforms
import numpy as np

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

# =====================================================
# FACE DETECTOR
# =====================================================

face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades +
    "haarcascade_frontalface_default.xml"
)

# =====================================================
# LOAD TRAINED CONVNEXT MODEL
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

print("Model Loaded Successfully!")

# =====================================================
# IMAGE TRANSFORM
# =====================================================

transform = transforms.Compose([
    transforms.ToPILImage(),
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

# =====================================================
# WEBCAM
# =====================================================

cap = cv2.VideoCapture(0)

print("Press Q to Quit")

while True:

    ret, frame = cap.read()

    if not ret:
        break

    gray = cv2.cvtColor(
        frame,
        cv2.COLOR_BGR2GRAY
    )

    faces = face_cascade.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=5,
        minSize=(80, 80)
    )

    for (x, y, w, h) in faces:

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

            probabilities = torch.softmax(
                logits,
                dim=1
            )

            probabilities = (
                probabilities
                .cpu()
                .numpy()[0]
            )

        emotion_index = np.argmax(
            probabilities
        )

        emotion = EMOTIONS[
            emotion_index
        ]

        confidence = probabilities[
            emotion_index
        ]

        cv2.rectangle(
            frame,
            (x, y),
            (x + w, y + h),
            (0, 255, 0),
            2
        )

        cv2.putText(
            frame,
            f"{emotion} : {confidence:.2f}",
            (x, y - 10),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            (0, 255, 0),
            2
        )

        break

    cv2.imshow(
        "Emotion Prediction",
        frame
    )

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()