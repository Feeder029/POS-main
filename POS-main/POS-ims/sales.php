<?php

$host = "localhost";
$user = "root";
$pass = "";
$db = "pos_db";

$conn = new mysqli($host, $user, $pass, $db);

if($conn->connect_error){
    die("Connection failed: " . $conn->connect_error);
}

$sql_order = "SELECT COUNT(`SalesID`) AS ORDERS FROM `sales` WHERE MONTH(Date) = MONTH(CURDATE())";

$result_order = $conn->query($sql_order);

$order;

if ($result_order->num_rows > 0) {
    while ($row_order = $result_order->fetch_assoc()) {
            $order = $row_order['ORDERS'];
} 
} 

$sql2 ="SELECT SUM(TotalAmount) as Amount
FROM sales s
WHERE MONTH(Date) = MONTH(CURDATE());";

$result2 = $conn->query($sql2);

$sales;

if ($result2->num_rows > 0) {
    while ($row2 = $result2->fetch_assoc()) {
            $sales = $row2['Amount'];
} 
} 

?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SALES</title>
    <link rel="stylesheet" href="sales.css?v=1.1">
    
</head>
<body>

    <div class="header">
        <!-- <div class="search-container">
            <button>Search</button>
        </div>
      <div class="profile-container">
        <h2>Admin</h2>
        <div class="circle-logo">
            <img src="#" alt="#">
        </div>
      </div> -->
    </div>
    <div class="date-header">
        <h1>Sales</h1>
        <button>
        <?php
          date_default_timezone_set('Asia/Manila');
          $formattedDate = date('F d Y'); 
          echo $formattedDate;
        ?>
        </button>
    </div>

    <div class="box-container">
            <div class="box">
                <label for="">Total Sales of the Month</label>
                <p><?php echo $sales ?></p>

            </div>
            <div class="box">
                <label for="">Total Orders of the Month</label>
                <p><?php echo $order ?></p>
            </div>
            <div class="box">
                <label for="">Items Sales of the Month</label>
                <canvas id="ItemsChart"> </canvas>
            </div>
            <div class="box">
                <label for="">Daily Sales</label>
                <canvas id="DailyChart">
                </canvas>
            </div>
    </div>

    <div class="activity-sales-container">
        <div class="recent-activity">
           <div class="recent-activity-label">
                <h1>Recent Activity</h1>
                <a href="">View</a>
           </div> 
           <div id="a">
                                    <!-- recent activity history -->   
            </div>
        </div>
        
        <div class="sales-container">
            <div class="sales-container-label">
                <h1>Monthly Sales</h1>
            </div>    
            <div class="graph">
            <canvas id="MonthlyChart"></canvas>     
           <!-- <canvas id="bar" ></canvas>  sales chart -->  
            </div>
        </div>
    </div>  

    <div class="forcast-container">
        <div class="sales-container">
            <div class="sales-container-label">
                <h1>Next 3 Months Sales Forecasting</h1>
            </div>    
            <div class="graph">
            <canvas id="Forecast"></canvas>     
           <!-- <canvas id="bar" ></canvas>  sales chart -->  
            </div>
        </div>


        <div class="sales-container">
            <div class="sales-container-label">
                <h1>Forecasted Stock for Next Month</h1>
            </div>    
            <div class="graph">
            <canvas id="Item_Forecast"></canvas>     
           <!-- <canvas id="bar" ></canvas>  sales chart -->  
            </div>
        </div>
    </div>

 
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script> <!-- Load Chart.js first -->
    
    <script src="reports.js?v=1.3"></script>


</body>
</html>