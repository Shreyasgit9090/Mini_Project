import cv2
import torch
import torch.nn as nn
import torchvision.models as models
from torchvision import transforms
from collections import deque
import numpy as np

# =====================================================
# SETTINGS
# =====================================================

WINDOW_SIZE = 5
DEVICE = "cpu"

# =====================================================
# FACE DETECTOR
# =====================================================

face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades +
    "haarcascade_frontalface_default.xml"
)

# =====================================================
# LOAD CONVNEXT
# =====================================================

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

model.classifier = nn.Identity()

model.eval()

print("ConvNeXt Loaded")

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
# TEMPORAL BUFFER
# =====================================================

feature_buffer = deque(maxlen=WINDOW_SIZE)

# =====================================================
# WEBCAM
# =====================================================

cap = cv2.VideoCapture(0)

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

            features = model(image)

            features = (
                features
                .squeeze(-1)
                .squeeze(-1)
                .numpy()[0]
            )

        feature_buffer.append(features)

        if len(feature_buffer) == WINDOW_SIZE:

            temporal_feature = np.mean(
                np.array(feature_buffer),
                axis=0
            )

            cv2.putText(
                frame,
                "Temporal Active",
                (20,40),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                (0,255,0),
                2
            )

            print(
                "Temporal Shape:",
                temporal_feature.shape
            )

        break

    cv2.imshow(
        "Temporal Face Features",
        frame
    )

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()