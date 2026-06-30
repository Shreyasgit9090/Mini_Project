import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, transforms, models
from torch.utils.data import DataLoader

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

print("Using:", device)

# -----------------------------
# DATA AUGMENTATION
# -----------------------------

train_transform = transforms.Compose([
    transforms.Grayscale(num_output_channels=3),
    transforms.Resize((224, 224)),
    transforms.RandomHorizontalFlip(),
    transforms.RandomRotation(10),
    transforms.ColorJitter(
        brightness=0.2,
        contrast=0.2
    ),
    transforms.ToTensor()
])

val_transform = transforms.Compose([
    transforms.Grayscale(num_output_channels=3),
    transforms.Resize((224, 224)),
    transforms.ToTensor()
])

# -----------------------------
# DATASETS
# -----------------------------

train_dataset = datasets.ImageFolder(
    "dataset/train",
    transform=train_transform
)

val_dataset = datasets.ImageFolder(
    "dataset/val",
    transform=val_transform
)

# -----------------------------
# DATALOADERS
# -----------------------------

train_loader = DataLoader(
    train_dataset,
    batch_size=64,
    shuffle=True,
    num_workers=4,
    pin_memory=True
)

val_loader = DataLoader(
    val_dataset,
    batch_size=64,
    shuffle=False,
    num_workers=4,
    pin_memory=True
)

# -----------------------------
# MODEL
# -----------------------------

model = models.resnet50(
    weights=models.ResNet50_Weights.DEFAULT
)

# Freeze backbone first

for param in model.parameters():
    param.requires_grad = False

model.fc = nn.Sequential(
    nn.Dropout(0.5),
    nn.Linear(
        model.fc.in_features,
        len(train_dataset.classes)
    )
)

# Train only classifier

for param in model.fc.parameters():
    param.requires_grad = True

model = model.to(device)

# -----------------------------
# LOSS & OPTIMIZER
# -----------------------------

criterion = nn.CrossEntropyLoss()

optimizer = optim.Adam(
    model.fc.parameters(),
    lr=1e-4
)

scheduler = optim.lr_scheduler.ReduceLROnPlateau(
    optimizer,
    mode="max",
    factor=0.5,
    patience=2
)

# -----------------------------
# TRAINING
# -----------------------------

epochs = 20

best_acc = 0
patience = 5
counter = 0

for epoch in range(epochs):

    model.train()

    running_loss = 0

    for images, labels in train_loader:

        images = images.to(device)
        labels = labels.to(device)

        optimizer.zero_grad()

        outputs = model(images)

        loss = criterion(outputs, labels)

        loss.backward()

        optimizer.step()

        running_loss += loss.item()

    # -------------------------
    # VALIDATION
    # -------------------------

    model.eval()

    correct = 0
    total = 0

    with torch.no_grad():

        for images, labels in val_loader:

            images = images.to(device)
            labels = labels.to(device)

            outputs = model(images)

            _, predicted = torch.max(outputs, 1)

            total += labels.size(0)
            correct += (predicted == labels).sum().item()

    val_acc = 100 * correct / total

    scheduler.step(val_acc)

    print(
        f"Epoch [{epoch+1}/{epochs}] "
        f"Loss: {running_loss/len(train_loader):.4f} "
        f"Val Accuracy: {val_acc:.2f}%"
    )

    # -------------------------
    # SAVE BEST MODEL
    # -------------------------

    if val_acc > best_acc:

        best_acc = val_acc

        torch.save(
            model.state_dict(),
            "models/best_model.pth"
        )

        print(
            f"Best model saved "
            f"({best_acc:.2f}%)"
        )

        counter = 0

    else:

        counter += 1

    # -------------------------
    # EARLY STOPPING
    # -------------------------

    if counter >= patience:

        print("Early stopping triggered.")

        break

print("\nTraining Complete")
print(f"Best Validation Accuracy: {best_acc:.2f}%")
