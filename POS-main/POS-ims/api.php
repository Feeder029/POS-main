<?php
// Define your API endpoint and API key
// define('API_URL', 'https://example.com/api/v2/db/_table/contact_info?limit=5');
// define('API_KEY', 'YOUR_API_KEY');

// // Set the Content-Type header
// header('Content-Type: application/json');

// // This function makes the cURL request
// function get_contact_info() {
//     $curl = curl_init();

//     // Set cURL options
//     curl_setopt_array($curl, [
//         CURLOPT_URL => API_URL,
//         CURLOPT_RETURNTRANSFER => true,
//         CURLOPT_ENCODING => "",
//         CURLOPT_MAXREDIRS => 10,
//         CURLOPT_TIMEOUT => 30,
//         CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
//         CURLOPT_CUSTOMREQUEST => "GET",
//         CURLOPT_HTTPHEADER => [
//             "cache-control: no-cache",
//             "X-DreamFactory-API-Key: " . API_KEY
//         ]
//     ]);

//     $response = curl_exec($curl);
//     $error = curl_error($curl);
//     curl_close($curl);

//     if ($error) {
//         return json_encode(["error" => "cURL error #: " . $error]);
//     } else {
//         return $response;
//     }
// }

// // If the request method is GET, call the function and return the result
// if ($_SERVER['REQUEST_METHOD'] == 'GET') {
//     echo get_contact_info();
// } else {
//     echo json_encode(["error" => "Invalid request method. Only GET is allowed."]);
// }
?>

<?php
header('Content-Type: application/json');
$conn = new mysqli('localhost', 'root', '', 'ims_db');

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Handle GET request (Retrieve Products)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $result = $conn->query("SELECT `pname` AS ProductName, `base_price` AS ProductPrice, `quantity` AS Stock FROM `ims_product`");
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

    foreach ($data as $item) {
        if (isset($item['pname']) && isset($item['change'])) {
            $pname = $conn->real_escape_string($item['pname']);
            $change = intval($item['change']); // Should be negative to deduct stock

            // Ensure stock does not go below 0
            $sql = "UPDATE ims_product SET quantity = quantity + ($change) WHERE pname = '$pname' AND quantity + ($change) >= 0";

            if (!$conn->query($sql)) {
                $errors[] = "Failed to update stock for $pname";
            }
        } else {
            $errors[] = "Missing product name or stock change";
        }
    }

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

