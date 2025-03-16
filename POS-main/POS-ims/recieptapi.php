<?php

    $conn = new mysqli('localhost', 'root', '', 'pos_db'); // Connect to DB
    $result = $conn->query("SELECT
        a.`SalesID`,
        d.`ProductID`,
        d.`ProductName`,
        c.`Quantity`,
        GROUP_CONCAT(CONCAT(d.`ProductName`, ' x', c.`Quantity`, ' = ', c.`UnitPrice`)) AS `Products`,
        a.`TotalAmount`,
        a.`Date`,
        b.`PaymentMethodID`,
        b.`AmountPaid`,
        b.`ChangeGiven`,
        e.`MethodName` as PaymentMethod,
        CONCAT(f.first_name, ' ', f.last_name) as FullName,
        f.CustomerID,
        f.email,
        f.phone
    FROM `sales` a
    JOIN `payments` b ON a.`SalesID` = b.`SalesID`
    JOIN `orders` c ON a.`SalesID` = c.`SalesID`
    JOIN `products` d ON c.`ProductID` = d.`ProductID`
    JOIN `paymentmethods` e ON e.`PayID` = b.`PaymentMethodID`
    JOIN  `customers` f ON f.CustomerID = a.CustomerID
    GROUP BY a.`SalesID`, a.`TotalAmount`, a.`Date`, b.`PaymentMethodID`, b.`AmountPaid`, b.`ChangeGiven`
    ORDER BY a.`Date` DESC;");


    $reciept = [];

    $filename = "inventory.csv";
    $file = fopen($filename, "w");

    fputcsv($file, ["Item Code", "Item Name", "Item Quantity"]);

    $items = [];
    while ($row = $result->fetch_assoc()) {
        $reciept[] = $row;
        fputcsv($file, [$row['ProductID'], $row['ProductName'], $row['Quantity']]);
        $items[] = "{$row['ProductID']},{$row['ProductName']},{$row['Quantity']}";
    }

    fclose($file);
    echo json_encode($reciept);
    $conn->close();

    $command = escapeshellcmd("python POS-main\POS-ims\qr-py\createQR.py" . escapeshellarg(json_encode($items)));
    $output = shell_exec($command);
?>