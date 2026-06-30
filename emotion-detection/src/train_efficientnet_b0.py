import csv
import torch
import torch.nn as nn
import torch.optim as optim

from torchvision import datasets, transforms, models
from torch.utils.data import DataLoader
from torch.amp import autocast, GradScaler

device = torch.device(
    "cuda" if torch.cuda.is_available()
    else "cpu"
)

print("Using:", device)

# =====================================
# TRANSFORMS
# =====================================

train_transform = transforms.Compose([
    transforms.Grayscale(num_output_channels=3),
    transforms.Resize((224,224)),
    transforms.RandomHorizontalFlip(0.5),
    transforms.RandomRotation(15),
    transforms.RandomAffine(
        degrees=0,
        translate=(0.1,0.1)
    ),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485,0.456,0.406],
        std=[0.229,0.224,0.225]
    )
])

val_transform = transforms.Compose([
    transforms.Grayscale(num_output_channels=3),
    transforms.Resize((224,224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485,0.456,0.406],
        std=[0.229,0.224,0.225]
    )
])

# =====================================
# DATASETS
# =====================================

train_dataset = datasets.ImageFolder(
    "dataset/train",
    transform=train_transform
)

val_dataset = datasets.ImageFolder(
    "dataset/val",
    transform=val_transform
)

# =====================================
# DATALOADERS
# =====================================

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

# =====================================
# MODEL
# =====================================

model = models.efficientnet_b0(
    weights=models.EfficientNet_B0_Weights.DEFAULT
)

in_features = model.classifier[1].in_features

model.classifier = nn.Sequential(
    nn.Dropout(0.5),
    nn.Linear(
        in_features,
        len(train_dataset.classes)
    )
)

model = model.to(device)

# =====================================
# CLASS WEIGHTS
# =====================================

counts = [3995,436,4097,7215,4965,4830,3171]

weights = torch.tensor(
    [sum(counts)/c for c in counts],
    dtype=torch.float
).to(device)

criterion = nn.CrossEntropyLoss(
    weight=weights
)

# =====================================
# OPTIMIZER
# =====================================

optimizer = optim.AdamW(
    model.parameters(),
    lr=1e-4,
    weight_decay=1e-4
)

scheduler = optim.lr_scheduler.ReduceLROnPlateau(
    optimizer,
    mode="max",
    factor=0.5,
    patience=2
)

scaler = GradScaler("cuda")

# =====================================
# LOG FILE
# =====================================

with open(
    "outputs/efficientnet_b0_log.csv",
    "w",
    newline=""
) as f:

    writer = csv.writer(f)

    writer.writerow([
        "epoch",
        "train_loss",
        "train_acc",
        "val_acc"
    ])

# =====================================
# TRAINING
# =====================================

best_acc = 0
patience = 10
counter = 0

epochs = 30

for epoch in range(epochs):

    model.train()

    running_loss = 0

    train_correct = 0
    train_total = 0

    for images, labels in train_loader:

        images = images.to(device)
        labels = labels.to(device)

        optimizer.zero_grad()

        with autocast("cuda"):

            outputs = model(images)

            loss = criterion(
                outputs,
                labels
            )

        scaler.scale(loss).backward()

        scaler.step(optimizer)

        scaler.update()

        running_loss += loss.item()

        _, predicted = torch.max(
            outputs,
            1
        )

        train_total += labels.size(0)

        train_correct += (
            predicted == labels
        ).sum().item()

    train_acc = (
        100 * train_correct / train_total
    )

    model.eval()

    val_correct = 0
    val_total = 0

    with torch.no_grad():

        for images, labels in val_loader:

            images = images.to(device)
            labels = labels.to(device)

            outputs = model(images)

            _, predicted = torch.max(
                outputs,
                1
            )

            val_total += labels.size(0)

            val_correct += (
                predicted == labels
            ).sum().item()

    val_acc = (
        100 * val_correct / val_total
    )

    scheduler.step(val_acc)

    print(
        f"Epoch {epoch+1}/{epochs} | "
        f"Train {train_acc:.2f}% | "
        f"Val {val_acc:.2f}%"
    )

    with open(
        "outputs/efficientnet_b0_log.csv",
        "a",
        newline=""
    ) as f:

        writer = csv.writer(f)

        writer.writerow([
            epoch+1,
            running_loss/len(train_loader),
            train_acc,
            val_acc
        ])

    if val_acc > best_acc:

        best_acc = val_acc

        torch.save(
            model.state_dict(),
            "models/efficientnet_b0_best.pth"
        )

        print(
            f"Saved Best Model "
            f"({best_acc:.2f}%)"
        )

        counter = 0

    else:
        counter += 1

    if counter >= patience:

        print(
            "Early stopping triggered."
        )

        break

print(
    f"\nBest Validation Accuracy: "
    f"{best_acc:.2f}%"
)
