from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import qrcode
import csv
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

CSV_FILE = "POS-main/InAndOut/inventoryIn.csv"
QR_FOLDER = "POS-main/InAndOut/qrcode"

if not os.path.exists(QR_FOLDER):
    os.makedirs(QR_FOLDER)

def save_to_csv(data):
    file_exists = os.path.isfile(CSV_FILE)

    with open(CSV_FILE, mode="a", newline="") as file:
        writer = csv.writer(file)

        if not file_exists:
            writer.writerow(["Item ID", "Item Category", "Item Brand", "Item Name", "Item Model", 
                             "Item Description", "Item Quantity", "Item Unit", "Item Base Price", 
                             "Item Tax", "Item Supplier", "QR Code File"])

        itemID = data.get("product_name", "Unknown").replace(" ", "_")
        qr_filename = os.path.join(QR_FOLDER, f"{itemID}.png")
        writer.writerow([data["category"], data["brand"], data["product_name"], data["product_model"],
                         data["description"], data["quantity"], data["unit"], data["base_price"], 
                         data["product_tax"], data["supplier"], qr_filename])

    return qr_filename

def generate_qrcode(data, qr_filename):
    qr = qrcode.make(data)
    qr.save(qr_filename)
    print(f"QR Code saved: {qr_filename}")



if __name__ == "__main__":
    app.run(debug=True)
