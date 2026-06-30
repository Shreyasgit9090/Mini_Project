import csv
import torch
import torch.nn as nn
import torch.optim as optim

from torchvision import datasets, transforms, models
from torch.utils.data import DataLoader
from torch.amp import autocast, GradScaler

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

print("Using:", device)

# ==================================================
# TRANSFORMS
# ==================================================

train_transform = transforms.Compose([
    transforms.Grayscale(num_output_channels=3),
    transforms.Resize((224, 224)),
    transforms.RandomHorizontalFlip(p=0.5),
    transforms.RandomRotation(15),
    transforms.RandomAffine(
        degrees=0,
        translate=(0.1, 0.1)
    ),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

val_transform = transforms.Compose([
    transforms.Grayscale(num_output_channels=3),
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

# ==================================================
# DATASETS
# ==================================================

train_dataset = datasets.ImageFolder(
    "dataset/train",
    transform=train_transform
)

val_dataset = datasets.ImageFolder(
    "dataset/val",
    transform=val_transform
)

# ==================================================
# DATALOADERS
# ==================================================

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

# ==================================================
# MODEL
# ==================================================

model = models.resnet50(
    weights=models.ResNet50_Weights.DEFAULT
)

model.fc = nn.Sequential(
    nn.Dropout(0.5),
    nn.Linear(
        model.fc.in_features,
        len(train_dataset.classes)
    )
)

model = model.to(device)

# ==================================================
# CLASS WEIGHTS
# ==================================================

counts = [3995, 436, 4097, 7215, 4965, 4830, 3171]

weights = torch.tensor(
    [sum(counts) / c for c in counts],
    dtype=torch.float
).to(device)

criterion = nn.CrossEntropyLoss(
    weight=weights
)

scaler = GradScaler("cuda")

# ==================================================
# LOG FILE
# ==================================================

with open(
    "outputs/progressive_unfreezing_log.csv",
    "w",
    newline=""
) as f:

    writer = csv.writer(f)

    writer.writerow([
        "stage",
        "epoch",
        "train_loss",
        "train_acc",
        "val_acc"
    ])

# ==================================================
# TRAIN FUNCTION
# ==================================================

best_acc = 0
patience = 7
counter = 0


def train_stage(
    stage_name,
    epochs,
    optimizer,
    scheduler
):

    global best_acc
    global counter

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
            f"{stage_name} | "
            f"Epoch {epoch+1}/{epochs} | "
            f"Train {train_acc:.2f}% | "
            f"Val {val_acc:.2f}%"
        )

        with open(
            "outputs/progressive_unfreezing_log.csv",
            "a",
            newline=""
        ) as f:

            writer = csv.writer(f)

            writer.writerow([
                stage_name,
                epoch + 1,
                running_loss / len(train_loader),
                train_acc,
                val_acc
            ])

        if val_acc > best_acc:

            best_acc = val_acc

            torch.save(
                model.state_dict(),
                "models/progressive_unfreezing_best.pth"
            )

            print(
                f"New Best Model: "
                f"{best_acc:.2f}%"
            )

            counter = 0

        else:
            counter += 1

        if counter >= patience:

            print(
                "Early stopping triggered."
            )

            return

# ==================================================
# STAGE 1
# FC ONLY
# ==================================================

print("\n========== STAGE 1 ==========")

for param in model.parameters():
    param.requires_grad = False

for param in model.fc.parameters():
    param.requires_grad = True

optimizer = optim.AdamW(
    filter(
        lambda p: p.requires_grad,
        model.parameters()
    ),
    lr=1e-3,
    weight_decay=1e-4
)

scheduler = optim.lr_scheduler.ReduceLROnPlateau(
    optimizer,
    mode="max",
    factor=0.5,
    patience=2
)

train_stage(
    "Stage1_FC",
    5,
    optimizer,
    scheduler
)

# ==================================================
# STAGE 2
# LAYER4 + FC
# ==================================================

print("\n========== STAGE 2 ==========")

for param in model.layer4.parameters():
    param.requires_grad = True

optimizer = optim.AdamW(
    filter(
        lambda p: p.requires_grad,
        model.parameters()
    ),
    lr=1e-4,
    weight_decay=1e-4
)

scheduler = optim.lr_scheduler.ReduceLROnPlateau(
    optimizer,
    mode="max",
    factor=0.5,
    patience=2
)

train_stage(
    "Stage2_Layer4",
    10,
    optimizer,
    scheduler
)

# ==================================================
# STAGE 3
# FULL NETWORK
# ==================================================

print("\n========== STAGE 3 ==========")

for param in model.parameters():
    param.requires_grad = True

optimizer = optim.AdamW([
    {
        "params": model.layer1.parameters(),
        "lr": 1e-5
    },
    {
        "params": model.layer2.parameters(),
        "lr": 1e-5
    },
    {
        "params": model.layer3.parameters(),
        "lr": 3e-5
    },
    {
        "params": model.layer4.parameters(),
        "lr": 1e-4
    },
    {
        "params": model.fc.parameters(),
        "lr": 1e-4
    }
],
weight_decay=1e-4)

scheduler = optim.lr_scheduler.ReduceLROnPlateau(
    optimizer,
    mode="max",
    factor=0.5,
    patience=2
)

train_stage(
    "Stage3_Full",
    15,
    optimizer,
    scheduler
)

print(
    f"\nBest Validation Accuracy: "
    f"{best_acc:.2f}%"
)
