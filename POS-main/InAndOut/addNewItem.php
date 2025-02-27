<?php
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    header('Content-Type: application/json'); // Ensure JSON response


    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "ims_db";

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
    }

    $data = json_decode(file_get_contents("php://input"), true);

    // Debug: Check received data
    file_put_contents("debug_log.txt", print_r($data, true)); 

    if (!$data) {
        die(json_encode([
            "error" => "Invalid JSON data",
            "received" => file_get_contents("php://input") // Show raw input
        ]));
    }

    $required_fields = ["category", "brand", "product_name", "product_model", "description", "quantity", "unit", "base_price", "product_tax", "supplier"];
    foreach ($required_fields as $field) {
        if (!isset($data[$field]) || empty($data[$field])) {
            die(json_encode(["error" => "$field is required"]));
        }
    }

    $categoryid = intval($data["category"]);
    $brandid = intval($data["brand"]);
    $pname = $conn->real_escape_string($data["product_name"]);
    $model = $conn->real_escape_string($data["product_model"]);
    $description = $conn->real_escape_string($data["description"]);
    $quantity = intval($data["quantity"]);
    $unit = $conn->real_escape_string($data["unit"]);
    $base_price = floatval($data["base_price"]);
    $tax = floatval(value: $data["product_tax"]);
    $supplier = intval($data["supplier"]);

    $stmt = $conn->prepare("INSERT INTO ims_product (categoryid, brandid, pname, model, description, quantity, unit, base_price, tax, supplier) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("iisssdsdii", $categoryid, $brandid, $pname, $model, $description, $quantity, $unit, $base_price, $tax, $supplier);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Product added successfully"]);
    } else {
        echo json_encode(["error" => "Database error: " . $stmt->error]);
    }

    $stmt->close();
    $conn->close();
?>
