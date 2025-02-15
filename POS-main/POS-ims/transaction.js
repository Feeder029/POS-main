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
                <span><strong>${item.SalesID}</strong>: ${item.Date}</span>
                <button onclick="showReceipt(${item.SalesID})">Details</button>
            `; //Showing History

            transactionList.appendChild(transactionItem);

            let receipt = document.createElement('div');
            receipt.classList.add('receipt');
            receipt.id = `receipt-${item.SalesID}`;
            receipt.innerHTML = `
                <h2>Receipt</h2>
                <p><strong>Date:</strong> ${item.Date}</p>
                <div class="item">${item.Products.replace(/,/g, '<br>')}</div>
                <p class="total">Total: PHP ${item.TotalAmount}</p>
                <p><strong>Payment Method:</strong> ${item.PaymentMethod}</p>
                <p><strong>Amount Paid:</strong> PHP ${item.AmountPaid}</p>
                <p><strong>Change Given:</strong> PHP ${item.ChangeGiven}</p>
                <button onclick="hideReceipt(${item.SalesID})">Close</button>
            `; //Showing the Reciept Details

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
