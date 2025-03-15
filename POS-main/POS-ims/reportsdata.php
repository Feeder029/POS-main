<?php

$host = "localhost";
$user = "root";
$pass = "";
$db = "pos_db";

$conn = new mysqli($host, $user, $pass, $db);

if($conn->connect_error){
    die("Connection failed: " . $conn->connect_error);
}


//Daily Results SQL
$dailyresultssql = "SELECT
    DATE_FORMAT(dates.Date, '%m-%d') AS Daily,
    COALESCE(SUM(s.TotalAmount), 0) AS Amount
FROM 
    (SELECT CURDATE() - INTERVAL n DAY AS Date
     FROM (SELECT 0 AS n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL 
                 SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5) AS numbers
    ) AS dates
LEFT JOIN sales s ON DATE(s.Date) = dates.Date
GROUP BY dates.Date
ORDER BY dates.Date;";

$dailyresult = $conn->query($dailyresultssql);

$date = [];
$amount = [];

while ($row = $dailyresult->fetch_assoc()){
    $date[] = $row['Daily'];
    $amount[] = (float) $row['Amount'];
}

//Monthly Results SQL
$monthlyresultssql = "SELECT
    months.Month_Name AS Month_Report, 
    COALESCE(SUM(s.TotalAmount), 0) AS Amount
FROM 
    (SELECT 'January' AS Month_Name, '01' AS Month_Num UNION ALL
     SELECT 'February', '02' UNION ALL
     SELECT 'March', '03' UNION ALL
     SELECT 'April', '04' UNION ALL
     SELECT 'May', '05' UNION ALL
     SELECT 'June', '06' UNION ALL
     SELECT 'July', '07' UNION ALL
     SELECT 'August', '08' UNION ALL
     SELECT 'September', '09' UNION ALL
     SELECT 'October', '10' UNION ALL
     SELECT 'November', '11' UNION ALL
     SELECT 'December', '12') AS months
LEFT JOIN sales s ON DATE_FORMAT(s.Date, '%m') = months.Month_Num
                  AND YEAR(s.Date) = YEAR(CURDATE())
GROUP BY months.Month_Name, months.Month_Num
ORDER BY months.Month_Num;";

$monthlyresult = $conn->query($monthlyresultssql);

$months_name = [];
$monthlyamount = [];

while ($row = $monthlyresult->fetch_assoc()){
    $months_name[] = $row['Month_Report'];
    $monthlyamount[] = (float) $row['Amount'];
}

//Sales Forecasting

$Forecastsql ="SELECT *, DATE_FORMAT(Date,'%Y-%m') as Month, SUM(TotalAmount) as Amount
FROM sales s
where date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
group by month
order by month;";

$result = $conn->query($Forecastsql);

$sales_data = [];
$months = [];
$monthsrecorded = [];
$sales;

if ($result->num_rows > 0) {
    $i = 1; 
    while ($row = $result->fetch_assoc()) {
        $months[] = $i;
        $sales_data[] = $row['Amount']; 
        $monthsrecorded[] = $row['Month'];
        $i++;
} 
} 

$n = count($months);  // Total number of months 
$sum_x = array_sum($months);  // Sum of month indices
$sum_y = array_sum($sales_data);  // Sum of sales values
$sum_xy = 0;  // Sum of x * y (month * sales)
$sum_x_squared = 0;  // Sum of x^2 (month squared)


if($n>1){
// Loop through the months and sales data to calculate ∑xy and ∑x²
for ($i = 0; $i < $n; $i++) {
    $sum_xy += $months[$i] * $sales_data[$i];  // Multiply each month index by its sales value
    $sum_x_squared += $months[$i] ** 2;  // Square each month index
}

$m = ($n * $sum_xy - $sum_x * $sum_y) / ($n * $sum_x_squared - ($sum_x ** 2));
$b = ($sum_y - $m * $sum_x) / $n;

// Predict sales for the next 3 months
$predicted_month_1 = $m * ($n + 1) + $b;
$predicted_month_2 = $m * ($n + 2) + $b;
$predicted_month_3 = $m * ($n + 3) + $b;

} else {
    $last_sales = $sales_data[0]; // Get the only available sales amount
    $growth_rate = 0.05; // Assume a 5% monthly increase

    $predicted_month_1 = $last_sales * (1 + $growth_rate);
    $predicted_month_2 = $predicted_month_1 * (1 + $growth_rate);
    $predicted_month_3 = $predicted_month_2 * (1 + $growth_rate);
}

//Item Sales SQL
$BestProductSQL =  "SELECT
    DATE_FORMAT(s.Date, '%Y-%m') AS Month,
    p.ProductName,
    SUM(o.Quantity * o.UnitPrice) AS Total_Sales
FROM orders o
JOIN products p ON o.ProductID = p.ProductID
JOIN sales s ON o.SalesID = s.SalesID
WHERE YEAR(s.Date) = YEAR(CURDATE())
AND MONTH(s.Date) = MONTH(CURDATE())
GROUP BY Month, p.ProductName
ORDER BY Month DESC, Total_Sales DESC;";

$BP_result = $conn->query($BestProductSQL);

$BP_Name = [];
$BP_Sales = [];

while ($row = $BP_result->fetch_assoc()){
    $BP_Name[] = $row['ProductName'];
    $BP_Sales[] = (float) $row['Total_Sales'];
}

// Items Forecast Query
$ItemForecast = "SELECT 
    p.ProductID,
    p.ProductName,
    DATE_FORMAT(s.Date, '%Y-%m') AS Month,
    SUM(o.Quantity) AS TotalQuantity
FROM 
    orders o
JOIN 
    sales s ON o.SalesID = s.SalesID
JOIN 
    products p ON o.ProductID = p.ProductID
GROUP BY 
    p.ProductID, Month
ORDER BY 
    p.ProductID, Month;";

$ItemForecast_Res = $conn->query($ItemForecast);

// Organize data per product
$products = [];

while ($row = $ItemForecast_Res->fetch_assoc()) {
    $productId = $row['ProductID'];
    $productName = $row['ProductName'];
    $month = $row['Month'];
    $totalQuantity = $row['TotalQuantity'];

    if (!isset($products[$productId])) {
        $products[$productId] = ['name' => $productName, 'sales' => []];
    }

    $products[$productId]['sales'][] = ['month' => $month, 'quantity' => $totalQuantity];
}

// Function to calculate Linear Regression and forecast next month's stock
function forecast_stock($salesData) {
    $n = count($salesData);
    if ($n < 2) return null; // Need at least 2 months of data

    $sumX = 0; $sumY = 0; $sumXY = 0; $sumXX = 0;

    for ($i = 0; $i < $n; $i++) {
        $x = $i + 1; // Convert months into numerical sequence
        $y = $salesData[$i]['quantity'];

        $sumX += $x;
        $sumY += $y;
        $sumXY += $x * $y;
        $sumXX += $x * $x;
    }

    // Compute slope (m) and intercept (b)
    $m = ($n * $sumXY - $sumX * $sumY) / ($n * $sumXX - $sumX * $sumX);
    $b = ($sumY - $m * $sumX) / $n;

    // Predict next month (n + 1)
    $nextMonthIndex = $n + 1;
    return round($m * $nextMonthIndex + $b);
}

// Forecast for each product
$PP_Name = [];
$PP_Amount = [];

foreach ($products as $productId => $product) {
    $predictedStock = forecast_stock($product['sales']);

    if($predictedStock==null){

    } elseif($predictedStock<0) {

    }
    
    else {
        $PP_Name[] = $product['name'];
        $PP_Amount[] = $predictedStock !== null ? $predictedStock : 0;
    }
}


//Recent Activity
$RASQL= "SELECT SalesID, TotalAmount, 
DATE_FORMAT(Date, '%b %e, %Y, %l:%i %p') AS date_process
FROM sales
ORDER BY Date DESC
LIMIT 6
;";


$RA_result = $conn->query($RASQL);

$recentActivity = [];

while ($row = $RA_result->fetch_assoc()) {
    $recentActivity[] = [
        "RA_ID" => $row['SalesID'],  // Fix here
        "RA_Tot" => $row['TotalAmount'], // Fix here
        "RA_Dates" => $row['date_process'] // Fix here
    ];
}

// Get Customers
$CustomerSQL = "SELECT `CustomerID`, `first_name`, `last_name` FROM `customers`";
$Customer_result = $conn->query($CustomerSQL);

$Customers = []; // Initialize array

if ($Customer_result->num_rows > 0) {
    while ($row = $Customer_result->fetch_assoc()) {
        $Customers[] = [
            "Cus_ID" => $row['CustomerID'],
            "Cus_FN" => $row['first_name'],
            "Cus_LN" => $row['last_name']
        ];
    }
}


// Send Data
$data = [
    "dates" => $date,
    "amounts" => $amount,
    "M_Month" => $months_name,
    "M_Amount" => $monthlyamount,
    "PM1" => $predicted_month_1,
    "PM2" => $predicted_month_2,
    "PM3" => $predicted_month_3,
    "PM_Months" => $monthsrecorded, 
    "PM_Sales" => $sales_data,
    "BP_Name" => $BP_Name, 
    "BP_Sales" => $BP_Sales,
    "PP_Name" => $PP_Name,
    "PP_Amount" => $PP_Amount,
    "recentActivity" => $recentActivity,
    "CustomerList" => $Customers
];




echo json_encode($data); // Output as JSON

?>