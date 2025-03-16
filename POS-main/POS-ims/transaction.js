document.addEventListener('DOMContentLoaded', () => {
    fetch('recieptapi.php')
        .then(response => response.json())
        .then(data => {
            let transactionList = document.getElementById('transaction-list');
            let receiptContainer = document.getElementById('receipt-container');

            data.forEach(item => {
                let transactionItem = document.createElement('div');
                transactionItem.classList.add('transaction');

                transactionItem.innerHTML = `
                    <span><strong>OR${item.SalesID}</strong>: ${item.Date}</span>
                    <button class="details-btn" onclick="showReceipt(${item.SalesID}, this)">Details</button>
                `;

                transactionList.appendChild(transactionItem);

                let receipt = document.createElement('div');
                receipt.classList.add('receipt');
                receipt.id = `receipt-${item.SalesID}`;
                receipt.style.display = 'none'; // Initially hide receipts

                receipt.innerHTML = `
                    <h2 class="receipt-title">BIKE SALES RECEIPT</h2>
                    <hr>
                    <p><strong>Date:</strong> ${new Date(item.Date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} 
                    &nbsp; ${new Date(item.Date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase()}</p>
                    <p><strong>OR No.:</strong> ${item.SalesID}</p>
                    <hr>
                    <div class="item">
                        <p><strong>Items Purchased:</strong></p>
                        <p class="item-list"> ${item.Products.replace(/,/g, '<br>')} </p>
                    </div>
                    <hr>
                    <p class="total"><strong>Total: PHP ${item.TotalAmount}</strong></p>
                    <p><strong>Payment Method:</strong> ${item.PaymentMethod}</p>
                    <p><strong>Amount Paid:</strong> PHP ${item.AmountPaid}</p>
                    <p><strong>Change Given:</strong> PHP ${item.ChangeGiven}</p>
                    <hr>
                    <div class="qr-code">
                        <img src="../../Reciept_QR/${item.SalesID}.png" alt="Receipt QR Code">
                    </div>
                    <hr>
                    <div class="CustomerInfo">
                    <p><strong>Customer:</strong> ${item.FullName}</p>
                    <p><strong>Email:</strong> PHP ${item.email}</p>
                    <p><strong>Phone:</strong> PHP ${item.phone}</p>
                    </div>
                    <div class="button-container">
                        <button class="print-btn" onclick="printReceipt(${item.SalesID})">Print</button>
                        <button class="close-btn" onclick="hideReceipt(${item.SalesID})">Close</button>
                    </div>
                `;

                receiptContainer.appendChild(receipt);
            });
        })
        .catch(error => console.error('Error fetching receipt:', error));
});

function showReceipt(salesID, btn) {
    // Hide all receipts
    document.querySelectorAll('.receipt').forEach(receipt => {
        receipt.style.display = 'none';
    });

    // Enable all buttons before disabling the selected one
    document.querySelectorAll('.details-btn').forEach(button => {
        button.disabled = false;
    });

    // Show the selected receipt
    document.getElementById(`receipt-${salesID}`).style.display = 'block';

    // Disable the clicked button
    btn.disabled = true;
}

function hideReceipt(salesID) {
    // Hide the selected receipt
    document.getElementById(`receipt-${salesID}`).style.display = 'none';

    // Re-enable all "Details" buttons
    document.querySelectorAll('.details-btn').forEach(button => {
        button.disabled = false;
    });
}



document.addEventListener("DOMContentLoaded", function () {
    const receiptContainer = document.getElementById("receipt-container");
    const transactionList = document.getElementById("transaction-list");

    // Create an overlay for mobile popover effect
    const overlay = document.createElement("div");
    overlay.classList.add("overlay");
    document.body.appendChild(overlay);

    // Function to check if the screen is mobile or tablet
    function isMobileOrTablet() {
        return window.innerWidth <= 1024; 
    }

    // Function to show receipt
    function showReceipt() {
        if (isMobileOrTablet()) {
            receiptContainer.style.display = "block"; // Instantly show popover
            overlay.classList.add("active");
            receiptContainer.classList.add("active");
        } else {
            receiptContainer.style.display = "flex"; // Normal display on desktop
        }
    }

    // Function to hide receipt
    function hideReceipt() {
        if (isMobileOrTablet()) {
            receiptContainer.style.display = "none"; // Instantly hide on mobile
            overlay.classList.remove("active");
            receiptContainer.classList.remove("active");
        }
    }

    // Event listener for transaction buttons
    transactionList.addEventListener("click", function (e) {
        if (e.target.classList.contains("details-btn")) {
            showReceipt();
        }
    });

    // Hide receipt when clicking outside (on mobile/tablet)
    overlay.addEventListener("click", hideReceipt);

    // Event listener for close button inside receipt
    document.addEventListener("click", function (e) {
        if (e.target.classList.contains("close-btn")) {
            hideReceipt();
        }
    });
});





function printReceipt(salesID) {
    let receiptElement = document.getElementById(`receipt-${salesID}`);

    let date = receiptElement.querySelector("p:nth-of-type(1)").innerText;
    let productDetails = receiptElement.querySelector(".item").innerText;
    let totalAmount = receiptElement.querySelector(".total").innerText;
    let paymentMethod = receiptElement.querySelector("p:nth-of-type(3)").innerText;
    let amountPaid = receiptElement.querySelector("p:nth-of-type(4)").innerText;
    let changeGiven = receiptElement.querySelector("p:nth-of-type(5)").innerText;
    let qrCodeSrc = receiptElement.querySelector("img").src;

    let receiptText = `
    <div style="
        max-width: 90%;
        width: 300px;
        padding: 15px;
        border: 2px solid black;
        margin: auto;
        font-family: Arial, sans-serif;
        text-align: center;
        box-sizing: border-box;
    ">
        <h3 style="margin: 5px 0;">PURCHASE RECEIPT</h3>
        <hr>
        <p style="margin: 5px 0;">${date}</p>
        <hr>
        <p style="text-align: left;"><strong>Items Purchased:</strong></p>
        <p style="white-space: pre-wrap; text-align: left;">${productDetails}</p>
        <hr>
        <p style="font-weight: bold;">${totalAmount}</p>
        <p>${paymentMethod}</p>
        <p>${amountPaid}</p>
        <p>${changeGiven}</p>
        <hr>
        <img src="${qrCodeSrc}" alt="Receipt QR Code" style="max-width: 80%; height: auto; display:block; margin:10px auto;">
        <hr>
        <p>Thank you for your purchase!</p>
    </div>
    `;

    if (window.innerWidth < 768) {
        // Mobile & Tablet: Generate and Download PDF
        let pdfContent = `
        <html>
        <head>
            <title>Receipt</title>
        </head>
        <body>
            ${receiptText}
        </body>
        </html>
        `;

        let blob = new Blob([pdfContent], { type: "application/pdf" });
        let link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `Receipt_${salesID}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        // Desktop: Use old iframe print method
        let printWindow = document.createElement("iframe");
        printWindow.style.position = "absolute";
        printWindow.style.width = "0";
        printWindow.style.height = "0";
        printWindow.style.border = "none";
        document.body.appendChild(printWindow);

        let doc = printWindow.contentWindow.document;
        doc.open();
        doc.write(`
            <html>
            <head>
                <title>Print Receipt</title>
            </head>
            <body onload="window.print(); setTimeout(() => window.close(), 500);">
                ${receiptText}
            </body>
            </html>
        `);
        doc.close();
    }
}
