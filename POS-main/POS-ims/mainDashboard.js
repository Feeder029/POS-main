document.getElementById('clear-order').addEventListener('click', function() {
    document.getElementById('cart-items').innerHTML = '<li>No items in cart</li>';
    document.getElementById('total-price').innerText = '$0.00';
});

// Listen for messages from iframe (menu.html)
// Listen for messages from iframe (menu.html)
window.addEventListener('message', function(event) {
    // Make sure the message is coming from the iframe
    if (event.origin !== window.location.origin) return;

    const cartItems = document.getElementById('cart-items');
    const totalPriceElem = document.getElementById('total-price');

    // Recalculate the total price
    function recalculateTotal() {
        let total = 0;
        Array.from(cartItems.children).forEach(item => {
            const price = parseFloat(item.dataset.price) || 0; // Ensure price is a number
            const quantity = parseInt(item.dataset.quantity) || 0; // Ensure quantity is a number
            total += price * quantity;
        });

        // Handle empty cart
        totalPriceElem.innerText = `₱${(isNaN(total) ? 0 : total).toFixed(2)}`;
    }


    if (event.data.type === 'add-to-cart') {
        const { name, price } = event.data;

        // Check if the item already exists in the cart
        let existingItem = Array.from(cartItems.children).find(item => item.dataset.name === name);

        if (existingItem) {
            // Update the quantity if item already exists
            let currentQuantity = parseInt(existingItem.dataset.quantity);
            currentQuantity += 1;
            existingItem.dataset.quantity = currentQuantity;
            existingItem.textContent = `${name} - ₱${(price * currentQuantity).toFixed(2)} (x${currentQuantity})`;
        } else {
            // Add new item if it doesn't exist
            const newItem = document.createElement('li');
            newItem.textContent = `${name} - ₱${price.toFixed(2)} (x1)`;
            newItem.dataset.name = name;
            newItem.dataset.price = price;
            newItem.dataset.quantity = 1;
            cartItems.appendChild(newItem);
        }

        // Remove "No items in cart" if it exists
        const noItemsMessage = cartItems.querySelector('li');
        if (noItemsMessage && noItemsMessage.textContent === 'No items in cart') {
            cartItems.removeChild(noItemsMessage);
        }

        // Recalculate total price
        recalculateTotal();
    }

    if (event.data.type === 'remove-from-cart') {
        const { name } = event.data;

        // Find the item in the cart
        const itemToRemove = Array.from(cartItems.children).find(item => item.dataset.name === name);

        if (itemToRemove) {
            cartItems.removeChild(itemToRemove);
        }

        // Show "No items in cart" if cart is empty
        if (cartItems.children.length === 0) {
            const noItemsMessage = document.createElement('li');
            noItemsMessage.textContent = 'No items in cart';
            cartItems.appendChild(noItemsMessage);
        }

        // Recalculate total price
        recalculateTotal();
    }

    if (event.data.type === 'update-quantity') {
        const { name, price, quantity } = event.data;

        // Find the item in the cart
        const itemToUpdate = Array.from(cartItems.children).find(item => item.dataset.name === name);

        if (itemToUpdate) {
            if (quantity > 0) {
                itemToUpdate.textContent = `${name} - ₱${(price * quantity).toFixed(2)} (x${quantity})`;
                itemToUpdate.dataset.quantity = quantity;
            } else {
                cartItems.removeChild(itemToUpdate);
            }
        }

        // Show "No items in cart" if cart is empty
        if (cartItems.children.length === 0) {
            const noItemsMessage = document.createElement('li');
            noItemsMessage.textContent = 'No items in cart';
            cartItems.appendChild(noItemsMessage);
        }

        // Recalculate total price
        recalculateTotal();
    }
});


// User role and logout handling...
document.addEventListener("DOMContentLoaded", function () {
    const userRole = sessionStorage.getItem("userRole");

    // Redirect to login page if user is not logged in
    if (!userRole) {
        window.location.href = "index.html"; 
        return;
    }

    if (userRole === "customer") {
        // Remove dashboard, settings, and products links
        document.querySelector('a[href="dashboard.html"]')?.closest("li")?.remove();
        document.querySelector('a[href="settings.html"]')?.closest("li")?.remove();
        document.querySelector('a[href="products.html"]')?.closest("li")?.remove();
    }

    // Logout functionality
    document.getElementById("logout").addEventListener("click", function (event) {
        event.preventDefault();
        sessionStorage.clear(); // Clear session storage
        window.location.href = "index.html"; // Redirect to login page
    });
});

// Listen for the 'Confirm' button click event
document.getElementById('confirm-order').addEventListener('click', function() {
    const totalPriceElem = document.getElementById('total-price');
    const totalPrice = totalPriceElem.innerText.replace('$', '').trim(); // Get the total price without the dollar sign

    // Display an alert with the total price
    alert(`Your total order price is: ₱${totalPrice}`);
});
