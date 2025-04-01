import os
import torch
import torch.nn as nn
import timm
import torchvision.transforms as transforms
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image

app = Flask(__name__)
CORS(app)

# ✅ Load the trained model
MODEL_PATH = "model.pth"  # Make sure this is the correct path
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# ✅ Define class labels (Update this with actual class names)
class_names = ["recyclable", "non-recyclable"]  # Modify based on training data

# ✅ Define Model
def load_model():
    model = timm.create_model('efficientnet_b3.ra2_in1k', pretrained=False)

    # Load state_dict but EXCLUDE classifier layer
    checkpoint = torch.load(MODEL_PATH, map_location=device)

    filtered_checkpoint = {k: v for k, v in checkpoint.items() if "classifier" not in k}  # ✅ Remove classifier keys
    model.load_state_dict(filtered_checkpoint, strict=False)  # ✅ Load only matching layers

    # ✅ Update classifier manually
    num_classes = len(class_names)
    num_features = model.classifier.in_features
    model.classifier = nn.Linear(num_features, num_classes)

    model.to(device)
    model.eval()
    return model

model = load_model()

# ✅ Define Image Preprocessing
transform = transforms.Compose([
    transforms.Resize((384, 384)),  # Match model input size
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

# ✅ API Route for Prediction
@app.route('/app', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    image = Image.open(file).convert("RGB")
    image = transform(image).unsqueeze(0).to(device)

    with torch.no_grad():
        outputs = model(image)
        _, predicted = torch.max(outputs, 1)
        class_label = class_names[predicted.item()]

    return jsonify({"prediction": class_label})

# ✅ Run Flask App
if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)
