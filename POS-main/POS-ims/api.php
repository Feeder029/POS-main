<?php
header('Content-Type: application/json');
$conn = new mysqli('localhost', 'root', '', 'ims_db');

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Handle GET request (Retrieve Products)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $result = $conn->query("SELECT `pname` AS ProductName,`categoryid`, `base_price` AS ProductPrice, `quantity` AS Stock FROM `ims_product`");
    $products = [];
    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
    }
    echo json_encode($products);
}

// Handle POST request (Bulk Order Deduction)
elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!is_array($data)) {
        echo json_encode(["error" => "Invalid data format"]);
        exit();
    }

    $errors = [];
    $conn->begin_transaction(); // Start transaction

    // foreach ($data as $item) {
    //     if (isset($item['pname']) && isset($item['change'])) {
    //         $pname = $conn->real_escape_string($item['pname']);
    //         $change = intval($item['change']); // Should be negative to deduct stock

    //         // Ensure stock does not go below 0
    //         $sql = "UPDATE ims_product SET quantity = quantity + ($change) WHERE pname = '$pname' AND quantity + ($change) >= 0";

    //         if (!$conn->query($sql)) {
    //             $errors[] = "Failed to update stock for $pname";
    //         }
    //     } else {
    //         $errors[] = "Missing product name or stock change";
    //     }
    // }

    // Commit or rollback
    if (empty($errors)) {
        $conn->commit();
        echo json_encode(["message" => "Stock updated successfully"]);
    } else {
        $conn->rollback();
        echo json_encode(["error" => implode(", ", $errors)]);
    }
}

$conn->close();
?>

