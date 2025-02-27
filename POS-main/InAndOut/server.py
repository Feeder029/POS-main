from flask import Flask, jsonify
from flask_cors import CORS
import subprocess

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests

@app.route('/start-scan', methods=['GET'])
def start_scan():
    try:
        # Run the QR scanning script
        subprocess.Popen(["python", "POS-main/InAndOut/scanNewQR.py"])  # Adjust to "python3" if needed
        return jsonify({"message": "QR scan started"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
