<?php
$conn = new mysqli('localhost', 'root', '', 'pos_db');
$result = $conn->query("SELECT `ProductID`, `ProductName`, `Price` FROM `products`");

$productspos = [];
while ($row = $result->fetch_assoc()) {
    $productspos[] = $row;
}

echo json_encode($productspos);
$conn->close();
?>