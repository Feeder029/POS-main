fetch('reportsdata.php') 
.then(response => response.json()) 
.then(data => {
    var dailysales = document.getElementById('DailyChart').getContext('2d');
    var MonthlySales = document.getElementById('MonthlyChart').getContext('2d');
    var ForecastSales = document.getElementById('Forecast').getContext('2d');
    var ItemSales = document.getElementById('ItemsChart').getContext('2d');
    var ItemForecast = document.getElementById('Item_Forecast').getContext('2d');
    let BarLines= '#213555'; 
    
    // Daily Sales Chart
    var myLineChart = new Chart(dailysales, {
        type: 'line',
        data: {
            labels: data.dates, 
            datasets: [{
                label: 'Sales',
                data: data.amounts, 
                fill: true,
                borderColor: BarLines,
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
                borderColor:  BarLines,
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
                label: 'Forecast Sales',
                data: [...data.PM_Sales, data.PM1, data.PM2, data.PM3], // Ensure data matches labels
                fill: true,
                borderColor: BarLines,
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
                label: 'Item Sales',
                data: data.BP_Sales,
                fill: true,
                tension: 0.3,
                backgroundColor : BarLines,
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


    //Forecast Item Charts
    var myLineChart = new Chart(ItemForecast,{
        type:'bar',
        data:{
            labels: data.PP_Name,
            datasets: [{
                label: 'Forecast Stocks',
                data: data.PP_Amount,
                fill: true,
                tension: 0.3,
                backgroundColor : BarLines,
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


document.addEventListener('DOMContentLoaded', () => {
    console.log("DOMContentLoaded event fired, fetching data...");

    fetch('reportsdata.php')
    .then(response => {
        console.log("Response received:", response);
        return response.json();
    })
    .then(data => {
        console.log("Parsed JSON data:", data);

        let display = '';

        if (Array.isArray(data.recentActivity)) {
            console.log("recentActivity is an array with length:", data.recentActivity.length);

            data.recentActivity.forEach(item => {
                display += `
                    <div class="case">
                    <h3>
                        Sale completed: ₱${item.RA_Tot} (ID: ${item.RA_ID}) on ${item.RA_Dates}
                    </h3>
                    </div>`;
            });

            document.getElementById('a').innerHTML = display;
            console.log("Updated innerHTML of #a.");
        } else {
            console.error("recentActivity is not an array or is undefined:", data.recentActivity);
        }
    })
    .catch(error => console.error("Error fetching data:", error));
});
