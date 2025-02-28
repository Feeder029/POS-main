fetch('reportsdata.php') 
.then(response => response.json()) 
.then(data => {
    var dailysales = document.getElementById('DailyChart').getContext('2d');
    var MonthlySales = document.getElementById('MonthlyChart').getContext('2d');
    var ForecastSales = document.getElementById('Forecast').getContext('2d');
    var ItemSales = document.getElementById('ItemsChart').getContext('2d');
    var ItemForecast = document.getElementById('Item_Forecast').getContext('2d');

    
    // Daily Sales Chart
    var myLineChart = new Chart(dailysales, {
        type: 'line',
        data: {
            labels: data.dates, 
            datasets: [{
                label: 'Sales',
                data: data.amounts, 
                fill: true,
                borderColor: 'rgb(48, 241, 255)',
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    //Monthly Sales Chart
    var myLineChart = new Chart(MonthlySales,{
        type:'line',
        data:{
            labels: data.M_Month,
            datasets: [{
                label: 'Monthly Sales',
                data: data.M_Amount,
                fill: true,
                borderColor:  'rgb(48, 241, 255)',
                tension: 0.3
            }]
        }, 
        options: {
            responsive: true,
            scales:{
                y:{
                    beginAtZero: true                   
                }
            }
        }
    });

    //Forecast Sales Chart
    var myLineChart = new Chart(ForecastSales,{
        type:'line',
        data: {
            labels: [...data.PM_Months, "Next 1 Month", "Next 2 Months", "Next 3 Months"],  // Use spread operator
            datasets: [{
                label: 'Monthly Sales',
                data: [...data.PM_Sales, data.PM1, data.PM2, data.PM3], // Ensure data matches labels
                fill: true,
                borderColor: 'rgb(48, 241, 255)',
                tension: 0.3
            }]
        },
        
        options: {
            responsive: true,
            scales:{
                y:{
                    beginAtZero: true                   
                }
            }
        }
    });


    //Item Sales Chart
    var myLineChart = new Chart(ItemSales,{
        type:'bar',
        data:{
            labels: data.BP_Name,
            datasets: [{
                label: 'Monthly Sales',
                data: data.BP_Sales,
                fill: true,
                tension: 0.3,
                backgroundColor : 'rgb(48, 241, 255)',
            }]
        }, 
        options: {
            responsive: true,
            scales:{
                y:{
                    beginAtZero: true                   
                }
            }
        }
    });  


})
.catch(error => console.error("Error fetching data:", error));
