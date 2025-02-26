import qrcode
import os

folder = "POS-main/POS-ims/qrcodes"
os.makedirs(folder, exist_ok=True)  # Create folder if it doesn't exist

qr = qrcode.make("Hello, QR Code!")
qr.save(os.path.join(folder, "test_qr.png"))

print(f"QR Code saved at: {folder}/test_qr.png")
