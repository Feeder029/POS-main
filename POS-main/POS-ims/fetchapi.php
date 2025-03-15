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
if (isset($data['TotalAmount'], $data['Date'], $data['CUS_ID'])) {
    $totalAmount = $conn->real_escape_string($data['TotalAmount']);
    $date = $conn->real_escape_string($data['Date']);
    $CustomerID = $conn->real_escape_string($data['CUS_ID']);

    // Insert query for sales table
    $salesQuery = "INSERT INTO sales (TotalAmount, Date, `CustomerID`) VALUES ('$totalAmount', '$date', '$CustomerID')";

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

if (isset($data['P_Name'], $data['P_Quantity'])) {
    $NName = $conn->real_escape_string($data['P_Name']);
    $Quantity = (int) $data['P_Quantity']; // Ensure it's an integer

    // Corrected SQL query with proper string handling
    $QuantityQuery = "UPDATE `products` 
                      SET `Temp_Sales` = COALESCE(`Temp_Sales`, 0) - $Quantity 
                      WHERE `ProductName` = '$NName'";

    if ($conn->query($QuantityQuery)) {
        $response['payments'] = ['status' => 'success', 'message' => 'Record updated successfully'];
    } else {
        $response['payments'] = ['status' => 'error', 'message' => 'Failed to update record', 'error' => $conn->error];
    }
} else {
    $response['payments'] = ['status' => 'error', 'message' => 'Invalid data provided'];
}


if (isset($data['ProductID'], $data['SalesID'], $data['Quantity'], $data['UnitPrice'])) {
    $PID = (int)$data['ProductID'];  // Ensure ProductID is an integer
    $SID = $conn->real_escape_string($data['SalesID']);
    $Q = (int)$data['Quantity'];  // Ensure Quantity is an integer
    $UP = $conn->real_escape_string($data['UnitPrice']);

    $OrderQuery = "INSERT INTO `orders`(`ProductID`, `SalesID`, `Quantity`, `UnitPrice`) 
                   VALUES ('$PID','$SID','$Q','$UP')";

    $TempQuery = "UPDATE `products` a 
                  SET a.`Temp_Sales` = COALESCE(a.`Temp_Sales`, 0) + $Q 
                  WHERE a.`ProductID` = $PID;";

    if ($conn->query($OrderQuery) && $conn->query($TempQuery)) { // Use same connection
        $response['payments'] = ['status' => 'success', 'message' => 'Record inserted successfully into payments table'];
    } else {
        $response['payments'] = ['status' => 'error', 'message' => 'Failed to insert record into payments table', 'error' => $conn->error];
    }
} else {
    $response['payments'] = ['status' => 'error', 'message' => 'Invalid payment data provided'];
}







echo json_encode($response); // Return JSON response

$conn->close();
?>