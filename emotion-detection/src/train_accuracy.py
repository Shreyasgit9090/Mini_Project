import torch
import torch.nn as nn
from torchvision import datasets, transforms, models
from torch.utils.data import DataLoader
from sklearn.metrics import classification_report, confusion_matrix

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

print("Using:", device)

# ----------------------------------
# TEST TRANSFORM
# ----------------------------------

test_transform = transforms.Compose([
    transforms.Grayscale(num_output_channels=3),
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

# ----------------------------------
# DATASET
# ----------------------------------

test_dataset = datasets.ImageFolder(
    "dataset/test",
    transform=test_transform
)

test_loader = DataLoader(
    test_dataset,
    batch_size=64,
    shuffle=False,
    num_workers=4
)

# ----------------------------------
# MODEL
# ----------------------------------

model = models.resnet50(weights=None)

model.fc = nn.Sequential(
    nn.Dropout(0.5),
    nn.Linear(
        model.fc.in_features,
        len(test_dataset.classes)
    )
)

# ----------------------------------
# LOAD BEST MODEL
# ----------------------------------

model.load_state_dict(
    torch.load(
        "models/resnet50_v2_best.pth",
        map_location=device
    )
)

model = model.to(device)
model.eval()

# ----------------------------------
# EVALUATION
# ----------------------------------

all_preds = []
all_labels = []

correct = 0
total = 0

with torch.no_grad():

    for images, labels in test_loader:

        images = images.to(device)
        labels = labels.to(device)

        outputs = model(images)

        _, preds = torch.max(outputs, 1)

        total += labels.size(0)
        correct += (preds == labels).sum().item()

        all_preds.extend(preds.cpu().numpy())
        all_labels.extend(labels.cpu().numpy())

accuracy = 100 * correct / total

print("\n" + "=" * 50)
print(f"TEST ACCURACY: {accuracy:.2f}%")
print("=" * 50)

print("\nClasses:")
print(test_dataset.classes)

print("\nClassification Report:\n")

print(
    classification_report(
        all_labels,
        all_preds,
        target_names=test_dataset.classes,
        digits=4
    )
)

print("\nConfusion Matrix:\n")

print(
    confusion_matrix(
        all_labels,
        all_preds
    )
)
