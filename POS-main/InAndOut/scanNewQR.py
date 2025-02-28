import cv2
import pandas as pd
import numpy as np
import requests
from pyzbar.pyzbar import decode

def display_output(df):
    product_name = df["Data"].iloc[0]  # Assuming the first column contains the product name
    api_url = "http://localhost:5000/api/scanned-data"  # Change if needed

    # Send scanned data to the API
    try:
        response = requests.post(api_url, json={"product_name": product_name})
        print(response.json())
    except Exception as e:
        print("Error sending data to API:", e)

def scan_qrcode_from_camera():
    cap = cv2.VideoCapture(0) #open camera
    print("Scanning for QR code. Press 'q' to quit.")
    
    while True:
        ret, frame = cap.read()
        if not ret:
            continue
        
        decoded_objects = decode(frame)
        data_list = []
        
        for obj in decoded_objects:
            qr_data = obj.data.decode('utf-8')
            qr_type = obj.type
            data_list.append([qr_data, qr_type])
            
            # Draw rectangle around QR code
            pts = obj.polygon
            if len(pts) == 4:
                pts = [(p.x, p.y) for p in pts]
                cv2.polylines(frame, [np.array(pts, dtype=np.int32)], True, (0, 255, 0), 2)
            
        cv2.imshow("QR Code Scanner", frame)
        
        if data_list:
            df = pd.DataFrame(data_list, columns=["Data", "Type"])
            cap.release()
            cv2.destroyAllWindows()
            display_output(df)
        
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    
    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    scan_qrcode_from_camera()