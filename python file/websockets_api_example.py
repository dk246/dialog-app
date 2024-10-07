from flask import Flask, request, jsonify, send_file
from flask_cors import CORS  # Import CORS
import websocket
import uuid
import json
import urllib.request
import urllib.parse
import random
import os
from io import BytesIO

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

server_address = "127.0.0.1:8188"
client_id = str(uuid.uuid4())

def queue_prompt(prompt):
    p = {"prompt": prompt, "client_id": client_id}
    data = json.dumps(p).encode('utf-8')
    req = urllib.request.Request(f"http://{server_address}/prompt", data=data)
    return json.loads(urllib.request.urlopen(req).read())

def get_image(filename, subfolder, folder_type):
    data = {"filename": filename, "subfolder": subfolder, "type": folder_type}
    url_values = urllib.parse.urlencode(data)
    with urllib.request.urlopen(f"http://{server_address}/view?{url_values}") as response:
        return response.read()

def get_history(prompt_id):
    with urllib.request.urlopen(f"http://{server_address}/history/{prompt_id}") as response:
        return json.loads(response.read())

def get_images(ws, prompt):
    prompt_id = queue_prompt(prompt)['prompt_id']
    output_images = {}
    while True:
        out = ws.recv()
        if isinstance(out, str):
            message = json.loads(out)
            if message['type'] == 'executing':
                data = message['data']
                if data['node'] is None and data['prompt_id'] == prompt_id:
                    break
        else:
            continue

    history = get_history(prompt_id)[prompt_id]
    for node_id in history['outputs']:
        node_output = history['outputs'][node_id]
        images_output = []
        if 'images' in node_output:
            for image in node_output['images']:
                image_data = get_image(image['filename'], image['subfolder'], image['type'])
                images_output.append(image_data)
        output_images[node_id] = images_output

    return output_images

@app.route('/generate', methods=['POST'])
def generate():
    data = request.json
    prompt_text = data.get("prompt", "beautiful girl")  # Default prompt
    seedNum = random.randint(1, 999999999)

    # Load your workflow JSON
    with open("workflow_api.json", "r", encoding="utf-8") as f:
        workflow_jsondata = f.read()

    prompt = json.loads(workflow_jsondata)
    prompt["6"]["inputs"]["text"] = prompt_text
    prompt["3"]["inputs"]["seed"] = seedNum

    ws = websocket.WebSocket()
    ws.connect(f"ws://{server_address}/ws?clientId={client_id}")
    images = get_images(ws, prompt)

    # Assuming there's at least one image returned
    if images:
        for node_id in images:
            if images[node_id]:
                image_data = images[node_id][0]  # Take the first image, or adjust logic if needed
                
                # Send the image data as a file-like object
                return send_file(BytesIO(image_data), mimetype='image/jpg')  # or 'image/jpeg'

    # If no images, return an error response
    return jsonify({"error": "No images generated"}), 400

if __name__ == '__main__':
    app.run(port=5000)  # Change the port if needed
