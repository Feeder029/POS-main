<?php

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "ims_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);
$qr_code = $data['qr_code'];

$sql = "SELECT product_name FROM products WHERE qr_code = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $qr_code);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    echo json_encode(["exists" => true, "product_name" => $row['product_name']]);
} else {
    echo json_encode(["exists" => false]);
}

$stmt->close();
$conn->close();
?>
