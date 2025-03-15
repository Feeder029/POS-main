const paymentInput = document.getElementById('payment');
const numButtons = document.querySelectorAll('.num');

numButtons.forEach(button => {
    button.addEventListener('click', () => {
        paymentInput.value += button.textContent.trim();
    });
});

document.getElementById('0').addEventListener('click', () => {
    paymentInput.value += '';
});

document.getElementById('Per').addEventListener('click', () => {
    if (!paymentInput.value.includes('.')) { 
        paymentInput.value += '.';
    }
});

document.getElementById('AC').addEventListener('click', () => {
    paymentInput.value = '';
});


//Fetch Customers
function ProductDisplay() {
    fetch('reportsdata.php')
        .then(response => response.json())
        .then(data => {
            let display = `<h7>CUSTOMER:</h7> 
            <select name="customer" id="customer">`;

            // Ensure data exists and contains customers
            if (data.CustomerList && data.CustomerList.length > 0) {
                data.CustomerList.forEach(item => {
                    display += `<option value="${item.Cus_ID}">${item.Cus_ID}: ${item.Cus_FN} ${item.Cus_LN}</option>`;
                });
            } else {
                display += `<option value="">No customers found</option>`;
            }

            display += `</select>`;

            // Add the display to the HTML
            document.getElementById('customer_list').innerHTML = display;
        })
        .catch(error => console.error('Error fetching reportsdata.php:', error));
}

// Call function when page loads
document.addEventListener("DOMContentLoaded", ProductDisplay);
