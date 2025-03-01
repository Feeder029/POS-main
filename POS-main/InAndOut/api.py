from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
import subprocess
import qrcode
import csv
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# ---------------------- DATABASE FUNCTION ---------------------- #
@app.route('/api/items', methods=['GET'])
def get_items():
    try:
        db = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="ims_db"
        )
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT * FROM items")
        items = cursor.fetchall()
        db.close()
        return jsonify(items)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ---------------------- QR SCANNER FUNCTION ---------------------- #
@app.route('/start-scan', methods=['GET'])
def start_scan():
    try:
        # Run the QR scanning script
        subprocess.Popen(["python", "POS-main/InAndOut/scanNewQR.py"])  # Adjust to "python3" if needed
        return jsonify({"message": "QR scan started"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ---------------------- ADD PRODUCT & GENERATE QR ---------------------- #
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

@app.route("/add-product", methods=["POST"])
def add_product():
    try:
        product_data = request.json
        print("Received data:", product_data)

        qr_filename = save_to_csv(product_data)
        generate_qrcode(str(product_data), qr_filename)

        response = jsonify({"message": "Product added successfully!", "qr_code": qr_filename})
        response.headers.add("Access-Control-Allow-Origin", "*")  # Allow all origins
        return response

    except Exception as e:
        return jsonify({"error": str(e)})

scanned_data = {"product_name": ""}  # Store the last scanned product

@app.route('/api/scanned-data', methods=['POST'])
def receive_scanned_data():
    global scanned_data
    data = request.json
    try:
        # Parse the JSON object properly
        product_info = eval(data.get("product_name", "{}"))  # Convert string to dictionary safely
        scanned_data["product_name"] = product_info.get("product_name", "")  # Extract only product_name
    except:
        scanned_data["product_name"] = ""  # Handle errors gracefully

    return jsonify({"message": "Scanned data received successfully!"})

@app.route('/api/get-scanned-data', methods=['GET'])
def get_scanned_data():
    return jsonify(scanned_data)

@app.route('/api/reset-scanned-data', methods=['POST'])
def reset_scanned_data():
    global scanned_data
    scanned_data = {"product_name": ""}  # Clear the last scanned product
    return jsonify({"message": "Scanned data reset successfully!"})

# ---------------------- RUN THE FLASK SERVER ---------------------- #
if __name__ == "__main__":
    app.run(debug=True, port=5000)  # Running on Port 5000
