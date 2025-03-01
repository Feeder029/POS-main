<?php
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    header('Content-Type: application/json');

    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "ims_db";

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
    }

    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data) {
        die(json_encode(["error" => "Invalid JSON data"]));
    }

    if (!isset($data["product_name"]) || !isset($data["quantity"])) {
        die(json_encode(["error" => "Product name and quantity are required"]));
    }

    $pname = $conn->real_escape_string($data["product_name"]);
    $quantity = intval($data["quantity"]);

    // Check if product exists
    $query = "SELECT quantity FROM ims_product WHERE pname = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $pname);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($current_quantity);
        $stmt->fetch();
        $new_quantity = $current_quantity - $quantity;

        $update_query = "UPDATE ims_product SET quantity = ? WHERE pname = ?";
        $update_stmt = $conn->prepare($update_query);
        $update_stmt->bind_param("is", $new_quantity, $pname);

        if ($update_stmt->execute()) {
            echo json_encode(["message" => "Quantity Deducted successfully", "new_quantity" => $new_quantity]);
        } else {
            echo json_encode(["error" => "Failed to update quantity"]);
        }

        $update_stmt->close();
    } else {
        echo json_encode(["error" => "Product not found"]);
    }

    $stmt->close();
    $conn->close();
?>
