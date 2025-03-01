from flask import Flask, request, jsonify
from flask_cors import CORS

import csv
import qrcode
import os

app = Flask(__name__)
CORS(app)  # Allow all origins

CSV_FILE = "sales_data.csv"

# Ensure CSV file exists
if not os.path.exists(CSV_FILE):
    with open(CSV_FILE, mode="w", newline="") as file:
        writer = csv.writer(file)
        writer.writerow(["SalesID", "Status"])  # Header

# Function to update CSV
def update_csv(salesID):
    with open(CSV_FILE, mode="a", newline="") as file:
        writer = csv.writer(file)
        writer.writerow([salesID, "Not Delivered"])
    print(f"SalesID {salesID} marked as 'Not Delivered' in {CSV_FILE}")

# Function to generate QR code
def generate_qr(salesID):
    qr_data = f"SalesID: {salesID}"
    qr = qrcode.make(qr_data)

    qr_filename = f"qrcodes/{salesID}.png"
    os.makedirs("qrcodes", exist_ok=True)  # Ensure directory exists

    qr.save(qr_filename)
    print(f"QR code saved as {qr_filename}")
    return qr_filename

# API endpoint to receive salesID
@app.route('/generate_qr', methods=['POST'])
def handle_request():
    data = request.get_json()
    salesID = data.get("salesID")

    if not salesID:
        return jsonify({"error": "Missing SalesID"}), 400

    update_csv(salesID)
    qr_filename = generate_qr(salesID)

    return jsonify({"message": "QR Code Generated", "qr_path": qr_filename})

if __name__ == '__main__':
    app.run(debug=True)
