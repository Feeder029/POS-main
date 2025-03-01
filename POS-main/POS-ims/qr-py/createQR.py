import qrcode
import csv
import os
import sys
import json

try:
    import qrcode
except ImportError:
    print("qrcode module not found. Install it using: pip install qrcode[pil]")
    exit()

def save_to_csv(SalesID, Deliver, itemquantity, filename="inventory.csv"):
    file_exists = os.path.isfile(filename)
    
    with open(filename, mode="a", newline="") as file:
        writer = csv.writer(file)
        
        if not file_exists:
            writer.writerow(["Item Code", "Item Name", "Item Quantity", "QR Code File"])
        
        qr_filename = f"qrcodes/{SalesID}.png"
        writer.writerow([SalesID, Deliver, qr_filename])

def generate_qrcode(data, folder="POS-main/POS-ims/qrcodes"):
    if not os.path.exists(folder):
        os.makedirs(folder)
    
    qr = qrcode.make(data)
    filepath = os.path.join(folder, f"{data.split(',')[1]}.png")
    qr.save(filepath)
    print(f"QR Code saved as {filepath}")

def main():
    
    if len(sys.argv) < 2:
        print("No data received from PHP.")
        return
    
    items_json = sys.argv[1]
    items = json.loads(items_json)  # Convert JSON string back to list
    
    for item in items:   
        SalesID, Deliver, itemquantity = item.split(",")
        save_to_csv(SalesID, Deliver, itemquantity)

        data = f"{SalesID},{Deliver},{itemquantity}"
        generate_qrcode(data)

    print("Record saved successfully.")

if __name__ == "__main__":
    main()