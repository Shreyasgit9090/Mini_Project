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

# Feature extractor

model.classifier = nn.Identity()

model.eval()

print("Model Loaded!")

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
# TEMPORAL BUFFER
# =====================================================

feature_buffer = deque(maxlen=WINDOW_SIZE)

# =====================================================
# WEBCAM
# =====================================================

cap = cv2.VideoCapture(0)

print("Press Q to Quit")

while True:

    ret, frame = cap.read()

    if not ret:
        break

    rgb = cv2.cvtColor(
        frame,
        cv2.COLOR_BGR2RGB
    )

    image = transform(rgb)

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
            "Temporal Window Active",
            (20, 40),
            cv2.FONT_HERSHEY_SIMPLEX,
            1,
            (0, 255, 0),
            2
        )

        print(
            "Temporal Feature Shape:",
            temporal_feature.shape
        )

    cv2.imshow(
        "Temporal Window Test",
        frame
    )

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()