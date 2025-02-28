<?php
header("Content-Type: application/json");
require "db.php"; // Include database connection file

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["product_id"])) {
    echo json_encode(["success" => false, "error" => "Product ID is missing"]);
    exit;
}

$product_id = $data["product_id"];
$stmt = $conn->prepare("SELECT product_name FROM products WHERE product_id = ?");
$stmt->bind_param("s", $product_id);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    echo json_encode(["success" => true, "product_name" => $row["product_name"]]);
} else {
    echo json_encode(["success" => false, "error" => "Product not found"]);
}

$stmt->close();
$conn->close();
?>
