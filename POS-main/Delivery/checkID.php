<?php

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "pos_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

$SalesID = $data['SalesID'];

$sql = "SELECT SalesID FROM sales WHERE SalesID = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $SalesID);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    echo json_encode(["exists" => true, "SalesID" => $row['SalesID']]);
} else {
    echo json_encode(["exists" => false]);
}

$stmt->close();
$conn->close();
?>
