document.getElementById("start-scan").addEventListener("click", function() {
    stopFetching = false; // Allow fetching again
    // Reset the Sales ID in the backend before starting
    fetch("http://127.0.0.1:5000/api/reset-sales-id", { method: "POST" })
    .then(() => console.log("SalesID reset before scanning"))
    .catch(error => console.error("Error resetting SalesID:", error));

    // Ensure previous intervals are cleared before starting a new one
    if (intervalID) {
        clearInterval(intervalID);
        intervalID = null;
    }

    intervalID = setInterval(updateProductName, 2000);
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
        
        if (stopFetching || !data.SalesID) return;

        if (data.SalesID) {
            let extractedSalesID = data.SalesID.replace(/[^\d]/g, ''); // Removes non-numeric characters

            fetch(`http://127.0.0.1:5000/api/check-item-receipt?SalesID=${encodeURIComponent(extractedSalesID)}`)
            .then(response => response.json())
            .then(itemData => {
                if (stopFetching) return;
                if (itemData.exists) {
                    document.querySelector("#container h1").textContent = data.SalesID;
                    document.getElementById("qr-result").textContent = "Waiting for scan...";     
                    document.getElementById("container").showPopover();
                    document.getElementById("scan-qr").style.visibility ="hidden";

                    clearInterval(intervalID);
                    intervalID = null;
                    stopFetching = true;      
                    
                } else {
                    document.getElementById("qr-result").textContent = "RECEIPT ID NOT FOUND";   
                    clearInterval(intervalID);       
                    intervalID = null;
                }
            })
            .catch(error => {
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
    document.getElementById("container").hidePopover();
     // Extract only the numeric part (if "SalesID: 64" is shown instead of "64")
    salesID = salesID.replace(/[^\d]/g, '');


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

function confirmDelivery() {
    let salesID = document.querySelector("#container h1").textContent.trim();
    salesID = salesID.replace(/[^\d]/g, ''); // Extract only numeric part

    if (!salesID) {
        alert("No SalesID available.");
        return;
    }

    // Step 1: Check delivery status
    fetch(`http://127.0.0.1:5000/api/check-delivery-status?SalesID=${encodeURIComponent(salesID)}`)
        .then(response => response.json())
        .then(data => {
            if (data.Status === "Delivered") {
                alert("Order already delivered.");
                return;
            }

            // Step 2: Get receipt details
            fetch(`http://127.0.0.1:5000/api/get-receipt?SalesID=${encodeURIComponent(salesID)}`)
                .then(response => response.json())
                .then(receiptData => {
                    if (receiptData.error || receiptData.orders.length === 0) {
                        alert("No orders found for this SalesID.");
                        return;
                    }

                    // Step 3: Deduct quantity from ims_db
                    let stockUpdates = receiptData.orders.map(order => {
                        return fetch("http://127.0.0.1:5000/api/deduct-stock", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                ProductName: order.ProductName,
                                quantity: order.Quantity
                            })
                        })
                        .then(response => response.json())
                        .then(stockUpdate => {
                            console.log(`Stock updated for ${order.ProductName}`, stockUpdate);
                        })
                        .catch(error => console.error("Error updating stock:", error));
                    });

                    Promise.all(stockUpdates).then(() => {
                        stopFetching = true;
                        // Step 4: Update order status
                        fetch("http://localhost:5000/api/status-update", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({ SalesID: salesID })
                        })
                        .then(() => {
                            document.getElementById("container").hidePopover();
                            alert("Stock updated successfully!");
                            resetScanner(); // Restart scanning for new sales ID
                        })
                        .catch(error => {
                            console.error("Error updating status:", error);
                        });
                    });
                })
                .catch(error => {
                    console.error("Error fetching receipt:", error);
                    alert("Failed to process receipt.");
                });
        })
        .catch(error => {
            console.error("Error checking delivery status:", error);
            alert("Failed to check delivery status.");
        });
}


function resetScanner() {
    stopFetching = true;
    clearInterval(intervalID);
    intervalID = null;

    document.getElementById("qr-result").textContent = "Waiting for scan...";
    document.querySelector("#container h1").textContent = "";
    document.getElementById("scan-qr").style.visibility = "visible";
    document.getElementById("container").hidePopover();
    document.getElementById("")

    // **New Fix: Clear scanned SalesID manually**
    fetch("http://127.0.0.1:5000/api/reset-sales-id", { method: "POST" })
    .then(() => {
        console.log("SalesID reset in backend.");
    })
    .catch(error => {
        console.error("Error resetting SalesID:", error);
    });

    // Restart fetching after a delay
    setTimeout(() => {
        stopFetching = false;
        intervalID = setInterval(updateProductName, 2000);
    }, 2000);
}

