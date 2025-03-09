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
