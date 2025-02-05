<?php
header('Content-Type: application/json'); // Set response format

$conn = new mysqli('localhost', 'root', '', 'pos_db'); // Connect to DB

// Read JSON data from the request
$data = json_decode(file_get_contents('php://input'), true);

// Check if the data is being received properly
if (!$data) {
    echo json_encode(['error' => 'Invalid or missing JSON data.']);
    exit();
}

$response = [];  // Initialize response

// Check if required data is provided for sales
if (isset($data['TotalAmount'], $data['Date'])) {
    $totalAmount = $conn->real_escape_string($data['TotalAmount']);
    $date = $conn->real_escape_string($data['Date']);

    // Insert query for sales table
    $salesQuery = "INSERT INTO sales (TotalAmount, Date) VALUES ('$totalAmount', '$date')";

    if ($conn->query($salesQuery)) {
        $response['sales'] = ['status' => 'success', 'message' => 'Record inserted successfully into sales table'];
    } else {
        $response['sales'] = ['status' => 'error', 'message' => 'Failed to insert record into sales table'];
    }
} else {
    $response['sales'] = ['status' => 'error', 'message' => 'Invalid sales data provided'];
}

// Check if required data is provided for products
if (isset($data['ProductName'], $data['Price'])) {
    $productName = $conn->real_escape_string($data['ProductName']);
    $price = $conn->real_escape_string($data['Price']);

    // Insert query for products table
    $productsQuery = "INSERT INTO products (ProductName, Price) VALUES ('$productName', '$price')";

    if ($conn->query($productsQuery)) {
        $response['products'] = ['status' => 'success', 'message' => 'Record inserted successfully into products table'];
    } else {
        $response['products'] = ['status' => 'error', 'message' => 'Failed to insert record into products table'];
    }
} else {
    $response['products'] = ['status' => 'error', 'message' => 'Invalid product data provided'];
}

echo json_encode($response); // Return JSON response

$conn->close();
?>
