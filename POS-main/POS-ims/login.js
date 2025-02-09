document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById('loginform');
    const signupForm = document.getElementById('signupform');
    const toggleFormText = document.getElementById('toggle-form');
    const signupLink = document.getElementById('signup-link');
    const loginLink = document.getElementById('login-link');

    // Toggle between Signup and Login forms
    toggleFormText.addEventListener('click', function(event) {
        // Check if the clicked link is the signup link or login link
        if (event.target && event.target.id === 'signup-link') {
            event.preventDefault();
            loginForm.classList.toggle('hidden');
            signupForm.classList.toggle('hidden');
            toggleFormText.innerHTML = loginForm.classList.contains('hidden') 
                ? 'Already have an account? <a id="login-link">Login</a>'
                : 'Don\'t have an account? <a id="signup-link">Sign up</a>';
        }

        if (event.target && event.target.id === 'login-link') {
            event.preventDefault();
            signupForm.classList.toggle('hidden');
            loginForm.classList.toggle('hidden');
            toggleFormText.innerHTML = loginForm.classList.contains('hidden')
                ? 'Already have an account? <a id="login-link">Login</a>'
                : 'Don\'t have an account? <a id="signup-link">Sign up</a>';
        }
    });

   
    document.getElementById('loginform').addEventListener('submit', function(event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username === 'admin' && password === 'admin123') {
            sessionStorage.setItem('userRole', 'admin');
            alert('Login successfully!');
            window.location.href = "mainDashboard.html";
        } else if (username === 'customer' && password === 'customer123') {
            sessionStorage.setItem('userRole', 'customer');
            alert('Login successfully!');
            window.location.href = "mainDashboard.html";
        } else {
            alert('Invalid username or password!');
        }
    });
});
