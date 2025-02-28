<?php

$host = "localhost";
$user = "root";
$pass = "";
$db = "pos_db";

$conn = new mysqli($host, $user, $pass, $db);


if($conn->connect_error){
    die("Connection failed: " . $conn->connect_error);
}

$sql2 ="SELECT SUM(TotalAmount) as Amount
FROM sales s
where date >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH);";

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

            </div>
            <div class="box">
                <label for="">Total Orders</label>
                <p>$123,456.00</p>
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
            <canvas id="MonthlyChart"></canvas>     
           <!-- <canvas id="bar" ></canvas>  sales chart -->  
            </div>
        </div>
    </div>  

    <div class="activity-sales-container">
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
                <h1>Next Month's Item Forecast</h1>
            </div>    
            <div class="graph">
            <canvas id="Item_Forecast"></canvas>     
           <!-- <canvas id="bar" ></canvas>  sales chart -->  
            </div>
        </div>
    </div>

 
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script> <!-- Load Chart.js first -->
    
    <script src="reports.js?v=1.1"></script>


    <script src="doughnutChart.js"></script>
    <script src="barChart.js"></script>
</body>
</html>