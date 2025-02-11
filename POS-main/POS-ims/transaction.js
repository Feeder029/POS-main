document.addEventListener('DOMContentLoaded', () => {
    fetch('recieptapi.php')
    .then(response => response.json())
    .then(data => {
        let display = '';
        
        data.forEach(item => {
            display += `
                <div class="receipt">
                    <h2>Receipt</h2>
                    <p><strong>Date:</strong> ${item.Date}</p>
                    <div class="item">${item.Products.replace(/,/g, '<br>')}</div>
                    <p class="total">Total: PHP ${item.TotalAmount}</p>
                    <p><strong>Payment Method:</strong> ${item.PaymentMethod}</p>
                    <p><strong>Amount Paid:</strong> PHP ${item.AmountPaid}</p>
                    <p><strong>Change Given:</strong> PHP ${item.ChangeGiven}</p>
                </div>
            `;
        });
        
        document.getElementById('receipt-container').innerHTML = display;
    })
    .catch(error => console.error('Error fetching receipt:', error));
});