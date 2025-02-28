
<?php

$host = "localhost";
$user = "root";
$pass = "";
$db = "pos_db";

$conn = new mysqli($host, $user, $pass, $db);


if($conn->connect_error){
    die("Connection failed: " . $conn->connect_error);
}

$sql ="SELECT *, DATE_FORMAT(Date,'%Y-%m') as Month, SUM(TotalAmount) as Amount
FROM sales s
where date >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)
group by month
order by month;";

$result = $conn->query($sql);


$sql2 ="SELECT SUM(TotalAmount) as Amount
FROM sales s
where date >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH);";

$result2 = $conn->query($sql2);

$sales_data = [];
$months = [];
$sales;

if ($result->num_rows > 0) {
    $i = 1; 
    while ($row = $result->fetch_assoc()) {
        $months[] = $i;
        $sales_data[] = $row['Amount']; 
        $i++;
} 
} 

if ($result2->num_rows > 0) {
    while ($row2 = $result2->fetch_assoc()) {
            $sales = $row2['Amount'];
    
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

// Display predictions
echo "Predicted Sales for the Next 3 Months using Linear Regression:<br>";
echo "Month 1: ₱" . number_format($predicted_month_1, 2) . "<br>";
echo "Month 2: ₱" . number_format($predicted_month_2, 2) . "<br>";
echo "Month 3: ₱" . number_format($predicted_month_3, 2) . "<br>";
} else {
    $last_sales = $sales_data[0]; // Get the only available sales amount
    $growth_rate = 0.05; // Assume a 5% monthly increase

    $predicted_month_1 = $last_sales * (1 + $growth_rate);
    $predicted_month_2 = $predicted_month_1 * (1 + $growth_rate);
    $predicted_month_3 = $predicted_month_2 * (1 + $growth_rate);
}

?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SALES</title>
    <link rel="stylesheet" href="sales.css">
    
</head>
<body>

    <div class="header">
        <div class="search-container">
            <button>Search</button>
        </div>
      <div class="profile-container">
        <h2>Admin</h2>
        <div class="circle-logo">
            <img src="#" alt="#">
        </div>
      </div>
    </div>
    <div class="date-header">
        <h1>Sales</h1>
        <button>Feb 12, 2025</button>
    </div>

    <div class="box-container">
            <div class="box">
                <label for="">Total Sales of the Month</label>
                <p><?php echo $sales ?></p>
                <label for="">Predictions:</label>
                <br>
                <h4>Month 1: <?php echo $predicted_month_1 ?></h4>
                <h4>Month 2: <?php echo $predicted_month_2 ?></h4>
                <h4>Month 3: <?php echo $predicted_month_3 ?></h4>
            </div>
            <div class="box">
                <label for="">Total Orders</label>
                <p>$123,456.00</p>
            </div>
            <div class="box">
                <label for="">Top Product</label>
                <p>$123,456.00</p>
            </div>
            <div class="box">
                <label for="">future features</label>
                <p>$123,456.00</p>
            </div>
    </div>

    <div class="activity-sales-container">
        <div class="recent-activity">
           <div class="recent-activity-label">
                <h1>Recent Activity</h1>
                <a href="">View</a>
           </div> 
           <div class="recent-activity-history">
                                    <!-- recent activity history -->   
            </div>
        </div>
        <div class="sales-container">
            <div class="sales-container-label">
                <h1>Monthly Sales</h1>
                <button>Month</button>
            </div>    
            <div class="graph">
                <canvas id="bar" ></canvas>   <!-- sales chart -->  
            </div>
        </div>
    </div>  

 

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="doughnutChart.js"></script>
    <script src="barChart.js"></script>
</body>
</html>