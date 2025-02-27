import cv2
import pandas as pd
import numpy as np
from pyzbar.pyzbar import decode

def display_output(df):
    output_window = "QR Code Data"
    text = df.to_string(index=False)
    blank_image = np.ones((1500, 1800, 3), dtype=np.uint8) * 255
    y0, dy = 50, 30
    
    for i, line in enumerate(text.split('\n')):
        y = y0 + i * dy
        cv2.putText(blank_image, line, (50, y), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 0), 2)
    
    cv2.imshow(output_window, blank_image)
    cv2.waitKey(0)
    cv2.destroyAllWindows()
    exit()

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