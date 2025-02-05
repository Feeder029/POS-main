// Get the input field
const paymentInput = document.getElementById('payment');

// Get all number buttons
const numButtons = document.querySelectorAll('.num');


// Add event listeners to number buttons
numButtons.forEach(button => {
    button.addEventListener('click', () => {
        paymentInput.value += button.textContent.trim();
    });
});

// Add event listener for the 0 button
document.getElementById('0').addEventListener('click', () => {
    paymentInput.value += '0';
});

// Add event listener for the decimal button
document.getElementById('Per').addEventListener('click', () => {
    if (!paymentInput.value.includes('.')) { // Ensure only one decimal point
        paymentInput.value += '.';
    }
});

// Correctly selecting the AC button by its ID
document.getElementById('AC').addEventListener('click', () => {
    paymentInput.value = '';
});
