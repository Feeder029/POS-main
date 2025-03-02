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

@app.route('/start-scan-receipt', methods=['GET'])
def start_scan_receipt():
    try:
        # Run the QR scanning script
        subprocess.Popen(["python", "POS-main/Delivery/scanQR.py"])  # Adjust to "python3" if needed
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

@app.route('/api/check-item', methods=['GET'])
def check_item():
    product_name = request.args.get("name", "")

    if not product_name:
        return jsonify({"error": "Missing product name"}), 400

    try:
        db = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="ims_db"
        )
        cursor = db.cursor()
        cursor.execute("SELECT * FROM ims_product WHERE pname = %s", (product_name,))
        result = cursor.fetchone()
        db.close()

        return jsonify({"exists": result[0] > 0})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ---------------------- RECEIPT ---------------------- #
scanned_data_receipt = {"SalesID": ""}  # Store the last scanned product

@app.route('/api/scanned-data-receipt', methods=['POST'])
def receive_scanned_data_receipt():
    global scanned_data_receipt
    data = request.json
    scanned_data_receipt["SalesID"] = data.get("SalesID", "")

    return jsonify({"message": "Scanned data received successfully!"})

@app.route('/api/get-scanned-data-receipt', methods=['GET'])
def get_scanned_data_receipt():
    return jsonify(scanned_data_receipt)

@app.route('/api/reset-scanned-data-receipt', methods=['POST'])
def reset_scanned_data_receipt():
    global scanned_data_receipt
    scanned_data_receipt = {"SalesID": ""}  # Clear the last scanned product
    return jsonify({"message": "Scanned data reset successfully!"})

@app.route('/api/check-item-receipt', methods=['GET'])
def check_item_receipt():
    SalesID = request.args.get("SalesID", "")

    if not SalesID:
        return jsonify({"error": "Missing product name"}), 400

    try:
        db = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="pos_db"
        )
        cursor = db.cursor()
        cursor.execute("SELECT * FROM sales WHERE SalesID = %s", (SalesID,))
        result = cursor.fetchone()
        db.close()

        return jsonify({"exists": result[0] > 0})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
 # ---------------------- RUN THE FLASK SERVER ---------------------- #
@app.route('/api/get-receipt', methods=['GET'])
def get_receipt():
    sales_id = request.args.get("SalesID", "")

    if not sales_id:
        return jsonify({"error": "Missing SalesID"}), 400

    try:
        db = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="pos_db"
        )
        cursor = db.cursor(dictionary=True)

        query = """
            SELECT 
                p.ProductID, 
                p.ProductName, 
                o.Quantity, 
                o.UnitPrice 
            FROM orders o
            JOIN Products p ON o.ProductID = p.ProductID
            WHERE o.SalesID = %s
        """
        cursor.execute(query, (sales_id,))
        orders = cursor.fetchall()
        db.close()

        return jsonify({"orders": orders})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
   
DELIVERY_CSV_FILE = "Reciept_Info.csv"

@app.route('/api/check-delivery-status', methods=['GET'])
def check_delivery_status():
    sales_id = request.args.get("SalesID", "")

    if not sales_id:
        return jsonify({"error": "Missing SalesID"}), 400

    if not os.path.exists(DELIVERY_CSV_FILE):
        return jsonify({"error": "Delivery records file not found"}), 500

    try:
        with open(DELIVERY_CSV_FILE, mode="r", newline="") as file:
            reader = csv.DictReader(file)
            for row in reader:
                if row.get("SalesID") == sales_id:
                    return jsonify({
                        "SalesID": sales_id,
                        "Status": row.get("Status", "Unknown")
                    })
                    
        return jsonify({"SalesID": sales_id, "Status": "Not Found"})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/status-update', methods=['POST'])
def status_update():
    try:
        data = request.json
        sales_id = data.get("SalesID", "")

        if not sales_id:
            return jsonify({"error": "Missing SalesID"}), 400

        updated_orders = []
        found = False

        # Read and update CSV records
        with open(DELIVERY_CSV_FILE, mode="r", newline="") as file:
            reader = csv.DictReader(file)
            for row in reader:
                if row["SalesID"].strip() == str(sales_id).strip() and row["Status"].strip().lower() == "not delivered":
                    row["Status"] = "Delivered"
                    found = True
                updated_orders.append(row)

        if not found:
            return jsonify({"error": "SalesID not found or already delivered"}), 404

        # Write back updated data
        with open(DELIVERY_CSV_FILE, mode="w", newline="") as file:
            fieldnames = ["SalesID", "Status"]
            writer = csv.DictWriter(file, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(updated_orders)

        return jsonify({"message": "Stock deducted and order marked as Delivered."})

    except Exception as e:
        return jsonify({"error": f"Failed to update delivery status: {str(e)}"}), 500


@app.route('/api/deduct-stock', methods=['POST'])
def deduct_stock():
    try:
        data = request.json
        print("Received data:", data)
        product_name = data.get("ProductName")
        quantity_to_deduct = data.get("quantity")

        if not product_name or quantity_to_deduct is None:
            print("Error: Missing ProductName or Quantity")  # Debugging line
            return jsonify({"error": "Missing ProductName or Quantity"}), 400

        ims_db = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="ims_db"
        )
        ims_cursor = ims_db.cursor()

        # Deduct stock
        update_query = """
            UPDATE ims_product
            SET quantity = quantity - %s
            WHERE pname = %s
        """
        ims_cursor.execute(update_query, (quantity_to_deduct, product_name))
        ims_db.commit()
        ims_db.close()
        status_update()
        return jsonify({"message": "Stock successfully deducted."})

    except Exception as e:
        return jsonify({"error": f"Failed to deduct stock: {str(e)}"}), 500

@app.route('/api/reset-sales-id', methods=['POST'])
def reset_sales_id():
    global last_scanned_sales_id
    last_scanned_sales_id = None  # Clear last scanned ID
    return jsonify({"message": "SalesID reset successfully."})

# ---------------------- RUN THE FLASK SERVER ---------------------- #
if __name__ == "__main__":
    app.run(debug=True, port=5000)  # Running on Port 5000


