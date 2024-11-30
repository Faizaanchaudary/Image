from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS from flask_cors
from diffusers import StableDiffusionPipeline
import torch
from io import BytesIO
from PIL import Image
import base64
import os

app = Flask(__name__)

CORS(app)  
pipe = StableDiffusionPipeline.from_pretrained("CompVis/stable-diffusion-v-1-4-original", 
                                               torch_dtype=torch.float16).to("cuda")

@app.route('/generate-image', methods=['POST'])
def generate_image():
    data = request.get_json()
    prompt = data.get("prompt")

    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400
    image = pipe(prompt).images[0]

    img_byte_arr = BytesIO()
    image.save(img_byte_arr, format="PNG")
    img_byte_arr.seek(0)

    img_base64 = base64.b64encode(img_byte_arr.getvalue()).decode("utf-8")

    return jsonify({"image": img_base64})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
