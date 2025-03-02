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
                    <button onclick="showReceipt(${item.SalesID})">Details</button>
                `;

                transactionList.appendChild(transactionItem);

                let receipt = document.createElement('div');
                receipt.classList.add('receipt');
                receipt.id = `receipt-${item.SalesID}`;
                receipt.innerHTML = `
                    <h2>Receipt</h2>
                    <p><strong>Date:</strong> ${item.Date}</p>
                    <div class="item">
                        <p> ${item.ProductID}: ${item.Products.replace(/,/g, '<br>')} </p>
                    </div>
                    <p class="total">Total: PHP ${item.TotalAmount}</p>
                    <p><strong>Payment Method:</strong> ${item.PaymentMethod}</p>
                    <p><strong>Amount Paid:</strong> PHP ${item.AmountPaid}</p>
                    <p><strong>Change Given:</strong> PHP ${item.ChangeGiven}</p>
                    <img src="../../Reciept_QR/${item.SalesID}.png" alt="Receipt QR Code" style="width:150px; height:auto; display:block; margin:10px auto;">
                    <button class="print-btn" onclick="printReceipt(${item.SalesID})">Print</button>
                    <button class="close-btn" onclick="hideReceipt(${item.SalesID})">Close</button>
                `;


                receiptContainer.appendChild(receipt);
            });
        })
        .catch(error => console.error('Error fetching receipt:', error));
});

function showReceipt(salesID) {
    document.getElementById(`receipt-${salesID}`).style.display = 'block';
}

function hideReceipt(salesID) {
    document.getElementById(`receipt-${salesID}`).style.display = 'none';
}

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
        width: 300px;
        padding: 15px;
        border: 2px solid black;
        margin: 0 auto;
        font-family: Arial, sans-serif;
        text-align: center;
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
        <img src="${qrCodeSrc}" alt="Receipt QR Code" style="width:150px; height:auto; display:block; margin:10px auto;">
        <hr>
        <p>Thank you for your purchase!</p>
    </div>
    `;

    let printWindow = document.createElement('iframe');
    printWindow.style.position = 'absolute';
    printWindow.style.width = '0';
    printWindow.style.height = '0';
    printWindow.style.border = 'none';
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