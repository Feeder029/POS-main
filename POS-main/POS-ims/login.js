document.addEventListener("DOMContentLoaded", function() {
    const adminUsername = 'admin';
    const adminPassword = 'admin123';
    const customerUsername = 'customer';
    const customerPassword = 'customer123';

    document.getElementById('loginform').addEventListener('submit', function(event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username === adminUsername && password === adminPassword) {
            sessionStorage.setItem('userRole', 'admin');
            alert('Login successfully!');
            window.location.href = "mainDashboard.html";
        } else if (username === customerUsername && password === customerPassword) {
            sessionStorage.setItem('userRole', 'customer');
            alert('Login successfully!');
            window.location.href = "mainDashboard.html";
        } else {
            alert('Invalid username or password!');
        }
    });
});