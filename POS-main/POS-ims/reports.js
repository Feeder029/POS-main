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


function printPage() {
    fetch('reportsdata.php')
        .then(response => response.json())
        .then(data => {
            let reportContent = `
                <html>
                <head>
                    <title>Sales Report</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        h1, h2 { text-align: center; margin-bottom: 10px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid black; padding: 8px; text-align: center; }
                        th { background-color: #213555; color: white; }
                        .chart-section { margin-top: 20px; text-align: center; page-break-before: always; }
                        .chart-section img { width: 100%; max-width: 800px; height: auto; }
                        .table-container { width: 100%; overflow-x: auto; }
                        @media print {
                            .chart-section { page-break-before: always; }
                            table { page-break-inside: avoid; } /* Avoid table breaking */
                            h2 { page-break-before: always; } /* Ensure new section starts on new page */
                        }
                    </style>
                </head>
                <body>
                    <h1>Sales Report</h1>
                    ${generateReportSection('DailyChart', 'Daily Sales Report', data.dates, data.amounts)}
                    ${generateReportSection('MonthlyChart', 'Monthly Sales Report', data.M_Month, data.M_Amount)}
                    ${generateReportSection('Forecast', 'Forecasted Sales Report', 
                        [...data.PM_Months, "Next 1 Month", "Next 2 Months", "Next 3 Months"], 
                        [...data.PM_Sales, data.PM1, data.PM2, data.PM3]
                    )}
                    ${generateReportSection('ItemsChart', 'Item Sales Report', data.BP_Name, data.BP_Sales)}
                    ${generateReportSection('Item_Forecast', 'Item Forecast Report', data.PP_Name, data.PP_Amount)}
                </body>
                </html>
            `;

            let printFrame = document.createElement('iframe');
            printFrame.style.position = 'absolute';
            printFrame.style.width = '0px';
            printFrame.style.height = '0px';
            printFrame.style.border = 'none';
            document.body.appendChild(printFrame);

            let doc = printFrame.contentWindow.document;
            doc.open();
            doc.write(reportContent);
            doc.close();

            printFrame.onload = function () {
                printFrame.contentWindow.print();
                setTimeout(() => document.body.removeChild(printFrame), 1000);
            };
        })
        .catch(error => console.error("Error fetching data:", error));
}

// Function to generate a report section with a chart and auto-adjusting table
function generateReportSection(canvasId, title, labels, values) {
    if (!labels || !values) return '';

    let tableRows = labels.map((label, index) => `
        <tr>
            <td>${label}</td>
            <td>₱${values[index].toLocaleString()}</td>
        </tr>
    `).join('');

    return `
        <div class="chart-section">
            <h2>${title}</h2>
            <img src="${document.getElementById(canvasId)?.toDataURL() || ''}" style="width: 100%; max-width: 800px; height: auto;" />
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function exportToExcel() {
    fetch('reportsdata.php')
        .then(response => response.json())
        .then(data => {
            let wb = XLSX.utils.book_new(); // Create a new Excel workbook
            
            // Function to add a sheet with data
            function addSheet(sheetName, labels, values) {
                if (!labels || !values) return;
                
                let sheetData = [["Category", "Amount"]]; // Table headers
                labels.forEach((label, index) => {
                    sheetData.push([label, values[index]]);
                });

                let ws = XLSX.utils.aoa_to_sheet(sheetData);
                XLSX.utils.book_append_sheet(wb, ws, sheetName);
            }

            // Add sheets for each report type
            addSheet("Daily Sales", data.dates, data.amounts);
            addSheet("Monthly Sales", data.M_Month, data.M_Amount);
            addSheet("Forecast Sales", 
                [...data.PM_Months, "Next 1 Month", "Next 2 Months", "Next 3 Months"], 
                [...data.PM_Sales, data.PM1, data.PM2, data.PM3]
            );
            addSheet("Item Sales", data.BP_Name, data.BP_Sales);
            addSheet("Item Forecast", data.PP_Name, data.PP_Amount);

            // Save the Excel file
            XLSX.writeFile(wb, "Sales_Report.xlsx");
        })
        .catch(error => console.error("Error fetching data:", error));
}



