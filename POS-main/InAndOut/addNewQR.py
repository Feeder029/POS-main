import qrcode
import csv
import os

try:
    import qrcode
except ImportError:
    print("qrcode module not found. Install it using: pip install qrcode[pil]")
    exit()

def save_to_csv(itemID, itemCategory, itemName, itemModel, itemDesc, itemQuantity, itemUnit, itemBP, itemTax, itemSupplier, filename="POS-main\InAndOut\inventoryIn.csv"):
    file_exists = os.path.isfile(filename)
    
    with open(filename, mode="a", newline="") as file:
        writer = csv.writer(file)
        
        if not file_exists:
            writer.writerow(["Item ID", "Item Category", "Item Name", "Item Model", "Item Description", "Item Quantity", "Item Unit", "Item Base Price", "Item Tax", "Item Supplier","QR Code File"])
        
        qr_filename = f"POS-main\InAndOut\qrcode/{itemID}-{itemName}.png"
        writer.writerow([itemID, itemCategory, itemName, itemModel, itemDesc, itemQuantity, itemUnit, itemBP, itemTax, itemSupplier, qr_filename])

def generate_qrcode(data, folder="POS-main\InAndOut\qrcode"):
    if not os.path.exists(folder):
        os.makedirs(folder)
    
    qr = qrcode.make(data)
    filepath = os.path.join(folder, f"{data.split(',')[1]}.png")
    qr.save(filepath)
    print(f"QR Code saved as {filepath}")

def main():
    itemID = input("Enter Item Code: ")
    itemCategory = input("Enter Item itemCategory: ")
    itemName = input("Enter Item itemName: ")
    itemModel = input("Enter Item itemModel: ")
    itemDesc =  input("Enter Item itemDesc: ")
    itemQuantity = input("Enter Item itemQuantity: ")
    itemUnit = input("Enter Item itemUnit: ")
    itemBP = input("Enter Item itemBP: ")
    itemTax = input("Enter Item itemTax: ")
    itemSupplier = input("Enter Item itemSupplier: ")
    
    data = f"{itemID},{itemCategory},{itemName},{itemModel},{itemDesc},{itemQuantity},{itemUnit},{itemBP},{itemTax},{itemSupplier}"
    generate_qrcode(data)
    save_to_csv(itemID, itemCategory, itemName, itemModel, itemDesc, itemQuantity, itemUnit, itemBP, itemTax, itemSupplier)
    
    print("Record saved successfully.")

if __name__ == "__main__":
    main()
