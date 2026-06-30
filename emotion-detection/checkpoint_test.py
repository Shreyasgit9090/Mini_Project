import torch
import torch.nn as nn
import torchvision.models as models

DEVICE = "cpu"

print("Creating ConvNeXt...")

model = models.convnext_tiny(weights=None)

in_features = model.classifier[2].in_features

model.classifier[2] = nn.Sequential(
    nn.Dropout(0.5),
    nn.Linear(in_features, 7)
)

print("Loading checkpoint...")

checkpoint = torch.load(
    "models/convnext_tiny_best.pth",
    map_location=DEVICE,
    weights_only=False
)

model.load_state_dict(checkpoint)

print("Checkpoint loaded successfully!")

print("\nModel ready.")