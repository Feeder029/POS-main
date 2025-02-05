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
    
    if (event.data.type === 'add-to-cart') {
        const { name, price } = event.data;

        // Add the item to the cart
        const totalPriceElem = document.getElementById('total-price');
        const totalPrice = parseFloat(totalPriceElem.innerText.replace('$', '').trim());

        // Check if the item already exists in the cart
        let existingItem = Array.from(cartItems.children).find(item => item.dataset.name === name);
        
        if (existingItem) {
            // Update the quantity if item already exists
            let currentQuantity = parseInt(existingItem.dataset.quantity);
            currentQuantity += 1;  // Increase quantity
            existingItem.dataset.quantity = currentQuantity;  // Update the quantity
            existingItem.textContent = `${name} - ₱${(price * currentQuantity).toFixed(2)} (x${currentQuantity})`; // Update text
        } else {
            // Add new item if it doesn't exist
            const newItem = document.createElement('li');
            newItem.textContent = `${name} - ₱${price.toFixed(2)} (x1)`; // Initialize quantity as 1
            newItem.dataset.name = name; // Add a custom data attribute to identify the item
            newItem.dataset.price = price; // Store the price as data
            newItem.dataset.quantity = 1; // Initialize quantity as 1
            cartItems.appendChild(newItem);
        }

        // Remove "No items in cart" if it exists
        const noItemsMessage = cartItems.querySelector('li');
        if (noItemsMessage && noItemsMessage.textContent === 'No items in cart') {
            cartItems.removeChild(noItemsMessage);
        }

        // Update total price
        const updatedTotalPrice = totalPrice + price;
        totalPriceElem.innerText = `$${updatedTotalPrice.toFixed(2)}`;
    }

    if (event.data.type === 'remove-from-cart') {
        const { name, price } = event.data;

        // Find the item in the cart
        const itemToRemove = Array.from(cartItems.children).find(item => item.dataset.name === name && parseFloat(item.dataset.price) === price);

        // If the item is found, remove it from the cart
        if (itemToRemove) {
            cartItems.removeChild(itemToRemove);

            // Update total price
            const totalPriceElem = document.getElementById('total-price');
            const totalPrice = parseFloat(totalPriceElem.innerText.replace('$', '').trim()) - price;
            totalPriceElem.innerText = `$${totalPrice.toFixed(2)}`;
        }

        // If no items left, show the default "No items in cart" message
        if (cartItems.children.length === 0) {
            const noItemsMessage = document.createElement('li');
            noItemsMessage.textContent = 'No items in cart';
            cartItems.appendChild(noItemsMessage);
        }
    }

    if (event.data.type === 'update-quantity') {
        const { name, price, quantity } = event.data;

        // Find the item in the cart
        const itemToUpdate = Array.from(cartItems.children).find(item => item.dataset.name === name && parseFloat(item.dataset.price) === price);

        // If the item is found, update the quantity
        if (itemToUpdate) {
            if (quantity > 0) {
                itemToUpdate.textContent = `${name} - ₱${(price * quantity).toFixed(2)} (x${quantity})`;
                itemToUpdate.dataset.quantity = quantity; // Update quantity in data attribute
            } else {
                // If quantity is zero, remove the item
                cartItems.removeChild(itemToUpdate);

                // Update total price
                const totalPriceElem = document.getElementById('total-price');
                const totalPrice = parseFloat(totalPriceElem.innerText.replace('$', '').trim()) - price;
                totalPriceElem.innerText = `$${totalPrice.toFixed(2)}`;
            }
        }

        // If no items left, show the default "No items in cart" message
        if (cartItems.children.length === 0) {
            const noItemsMessage = document.createElement('li');
            noItemsMessage.textContent = 'No items in cart';
            cartItems.appendChild(noItemsMessage);
        }
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
