<?php

$conn = new mysqli('localhost', 'root', '', 'pos_db'); // Connect to DB
$result = $conn->query("SELECT
    a.`SalesID`,
    GROUP_CONCAT(CONCAT(d.`ProductName`, ' x', c.`Quantity`, ' = ', c.`UnitPrice`)) AS `Products`,
    a.`TotalAmount`,
    a.`Date`, 
    b.`PaymentMethodID`,
    b.`AmountPaid`,
    b.`ChangeGiven`,
    e.`MethodName` as PaymentMethod
FROM `sales` a
JOIN `payments` b ON a.`SalesID` = b.`SalesID`
JOIN `orders` c ON a.`SalesID` = c.`SalesID`
JOIN `products` d ON c.`ProductID` = d.`ProductID`
JOIN `paymentmethods` e ON e.`PayID` = b.`PaymentMethodID`
GROUP BY a.`SalesID`, a.`TotalAmount`, a.`Date`, b.`PaymentMethodID`, b.`AmountPaid`, b.`ChangeGiven`");


$reciept = [];
while ($row = $result->fetch_assoc()) {
    $reciept[] = $row;
}

echo json_encode($reciept);
$conn->close();
?>