document.getElementById("start-scan").addEventListener("click", function() {
    fetch("http://127.0.0.1:5000/start-scan-receipt")
    .then(response => response.json())
    .then(data => {
        document.getElementById("qr-result").textContent = data.message;
    })
    .catch(error => {
        console.error("Error:", error);
        document.getElementById("qr-result").textContent = "Failed to start scanning.";
    });
});

let stopFetching = false;
let intervalID = setInterval(updateProductName, 2000);

function updateProductName() {
    if (stopFetching) return;

    fetch("http://localhost:5000/api/get-scanned-data-receipt")
    .then(response => response.json())
    .then(data => {
        console.log("Received Data:", data);

        if (data.SalesID) {
            let extractedSalesID = data.SalesID.replace(/[^\d]/g, ''); // Removes non-numeric characters

            fetch(`http://127.0.0.1:5000/api/check-item-receipt?SalesID=${encodeURIComponent(extractedSalesID)}`)
            .then(response => response.json())
            .then(itemData => {
                if (itemData.exists) {
                    document.querySelector("#container h1").textContent = data.SalesID;
                    document.getElementById("qr-result").textContent = "Waiting for scan...";     
                    clearInterval(intervalID);
                    stopFetching = true;      
                } else {
                    document.getElementById("qr-result").textContent = "Waiting for scan...";   
                    clearInterval(intervalID);       
                }
            })
            .catch(error => {
                alert("Error checking item in database:", error);
                document.getElementById("qr-result").textContent = "Error checking database.";
            });
        }
    })
    .catch(error => {
        console.error("Error:", error);
        document.getElementById("qr-result").textContent = "Error retrieving scanned data.";
    });
}

// Refresh the product name every 2 seconds
setInterval(updateProductName, 2000);
console.log("Sales ID:", data.SalesID);


function showReceipt() {
    let salesID = document.querySelector("#container h1").textContent.trim(); // Get SalesID from UI

     // Extract only the numeric part (if "SalesID: 64" is shown instead of "64")
    salesID = salesID.replace(/[^\d]/g, '');
    if (!salesID || salesID === "SALES ID") {
        alert("No SalesID available.");
        return;
    }

    fetch(`http://127.0.0.1:5000/api/get-receipt?SalesID=${encodeURIComponent(salesID)}`)
        .then(response => response.json())
        .then(data => {
            console.log("Received Data:", data);
            if (data.error) {
                alert("Error: " + data.error);
                return;
            }

            let receiptContainer = document.getElementById("receipt");
            receiptContainer.innerHTML = "<h1>Receipt</h1>";

            if (data.orders.length === 0) {
                receiptContainer.innerHTML += "<p>No orders found for this SalesID.</p>";
            } else {
                let table = "<table style='border-collapse: collapse; width: 100%; text-align: center;'><tr><th>Product Name</th><th>Quantity</th><th>Unit Price</th></tr>";
                data.orders.forEach(order => {
                    table += `<tr>
                                <td>${order.ProductName}</td>
                                <td>${order.Quantity}</td>
                                <td>${order.UnitPrice}</td>
                              </tr>`;
                });
                table += "</table>";
                receiptContainer.innerHTML += table;
            }
            receiptContainer.style.display = "block";
        })
        .catch(error => {
            console.error("Error fetching receipt:", error);
            alert("Failed to load receipt.");
        });
}
