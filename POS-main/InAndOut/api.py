from flask import Flask, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

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
    


if __name__ == "__main__":
    app.run(debug=True)
