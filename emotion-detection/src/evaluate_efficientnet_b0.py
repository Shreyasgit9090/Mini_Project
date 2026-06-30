import torch
import torch.nn as nn

from torchvision import datasets, transforms, models
from torch.utils.data import DataLoader

from sklearn.metrics import (
    classification_report,
    confusion_matrix
)

device = torch.device(
    "cuda" if torch.cuda.is_available()
    else "cpu"
)

print("Using:", device)

# =====================================
# TRANSFORMS
# =====================================

transform = transforms.Compose([
    transforms.Grayscale(num_output_channels=3),
    transforms.Resize((224,224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485,0.456,0.406],
        std=[0.229,0.224,0.225]
    )
])

# =====================================
# DATASET
# =====================================

test_dataset = datasets.ImageFolder(
    "dataset/test",
    transform=transform
)

test_loader = DataLoader(
    test_dataset,
    batch_size=64,
    shuffle=False,
    num_workers=4,
    pin_memory=True
)

# =====================================
# MODEL
# =====================================

model = models.efficientnet_b0(
    weights=None
)

in_features = model.classifier[1].in_features

model.classifier = nn.Sequential(
    nn.Dropout(0.5),
    nn.Linear(
        in_features,
        len(test_dataset.classes)
    )
)

# =====================================
# LOAD MODEL
# =====================================

model.load_state_dict(
    torch.load(
        "models/efficientnet_b0_best.pth",
        map_location=device
    )
)

model = model.to(device)

model.eval()

# =====================================
# EVALUATION
# =====================================

all_preds = []
all_labels = []

with torch.no_grad():

    for images, labels in test_loader:

        images = images.to(device)
        labels = labels.to(device)

        outputs = model(images)

        _, preds = torch.max(
            outputs,
            1
        )

        all_preds.extend(
            preds.cpu().numpy()
        )

        all_labels.extend(
            labels.cpu().numpy()
        )

correct = sum(
    p == l
    for p, l in zip(
        all_preds,
        all_labels
    )
)

accuracy = (
    100 * correct /
    len(all_labels)
)

print(
    f"\nTest Accuracy: "
    f"{accuracy:.2f}%\n"
)

print(
    classification_report(
        all_labels,
        all_preds,
        target_names=test_dataset.classes
    )
)

print("\nConfusion Matrix:\n")

print(
    confusion_matrix(
        all_labels,
        all_preds
    )
)
