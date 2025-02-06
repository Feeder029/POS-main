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
        $salesID = $conn->insert_id; // Get the last inserted ID
        $response['sales'] = ['status' => 'success', 'message' => 'Record inserted successfully into sales table', 'SalesID' => $salesID];
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

// Check if required data is provided for payment
if (isset($data['SalesID'], $data['PaymentMethodID'], $data['AmountPaid'], $data['ChangeGiven'])) {
    $SID = $conn->real_escape_string($data['SalesID']);
    $PMID = $conn->real_escape_string($data['PaymentMethodID']);
    $AP = $conn->real_escape_string($data['AmountPaid']);
    $CG = $conn->real_escape_string($data['ChangeGiven']);

    // Insert query for payment table
    $PayQuery = "INSERT INTO `payments`(`SalesID`, `PaymentMethodID`, `AmountPaid`, `ChangeGiven`) VALUES ('$SID', '$PMID', '$AP', '$CG')";
    if ($conn->query($PayQuery)) {
        $response['payments'] = ['status' => 'success', 'message' => 'Record inserted successfully into payments table'];
    } else {
        $response['payments'] = ['status' => 'error', 'message' => 'Failed to insert record into payments table'];
    }
} else {
    $response['payments'] = ['status' => 'error', 'message' => 'Invalid payment data provided'];
}


if (isset($data['ProductID'],$data['SalesID'],$data['Quantity'],$data['UnitPrice'])){
    $PID = $conn->real_escape_string($data['ProductID']);
    $SID = $conn->real_escape_string($data['SalesID']);
    $Q = $conn->real_escape_string($data['Quantity']);
    $UP = $conn->real_escape_string($data['UnitPrice']);

    $OrderQuery = "INSERT INTO `orders`(`ProductID`, `SalesID`, `Quantity`, `UnitPrice`)VALUES ('$PID','$SID','$Q','$UP')";

    if ($conn->query($OrderQuery)){
        $response['payments'] = ['status' => 'success', 'message' => 'Record inserted successfully into payments table'];
    } else {
        $response['payments'] = ['status' => 'error', 'message' => 'Failed to insert record into payments table'];
    }
} else {
    $response['payments'] = ['status' => 'error', 'message' => 'Invalid payment data provided'];
}





echo json_encode($response); // Return JSON response

$conn->close();
?>