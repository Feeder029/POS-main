const floatPanel = document.querySelector(".float-panel");

document.addEventListener("DOMContentLoaded", function () {
        // Automatically click the "Menu" link
        document.getElementById("toggleMenu").click();
    });

document.getElementById('clear-order').addEventListener('click', function() {
    document.getElementById('cart-items').innerHTML = '<li>No items in cart</li>';
    document.getElementById('total-price').innerText = '$0.00';

    floatPanel.classList.remove('active');
    floatPanel.classList.add("inactive");
    document.getElementById('confirm-order').innerText = 'Confirm Order';
    document.querySelector(".payment-container").style.display = "none";
    
    let itemCountElement = document.getElementById("item-count");

    if (itemCountElement) {
        itemCountElement.value = ""; // Clear the input field
    } else {
        console.error("Element with ID 'item-count' not found.");
    }
});

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

document.getElementById("toggleMenu").addEventListener("click", function(event) {
    let panel = document.querySelector(".float-panel");
    panel.style.display = "block"; // Show the panel
});

// Use querySelectorAll to target all elements with the class "otheroptions"
document.querySelectorAll(".otheroptions").forEach(function(element) {
    element.addEventListener("click", function(event) {
        let panel = document.querySelector(".float-panel");
        panel.style.display = "none"; // Hide the panel
    });
});

// User role and logout handling...
document.addEventListener("DOMContentLoaded", function () {
    const userRole = sessionStorage.getItem("userRole");

    // Redirect to login page if user is not logged in
    if (!userRole) {
        window.location.href = "index.html"; 
        return;
    }

    if (userRole === "cashier") {
        document.querySelector('a[href="members.html"]')?.closest("li")?.remove();
        document.querySelector('a[href="../Delivery/delivery.html"]')?.closest("li")?.remove();
        document.querySelector('a[href="../InAndOut/inventoryInOut.php"]')?.closest("li")?.remove();       
    } else if (userRole === "warehouse") {
        document.querySelector('a[href="http://localhost/POS-main/POS-main/POS-ims/menu.php"]')?.closest("li")?.remove();
        document.querySelector('a[href="sales.php"]')?.closest("li")?.remove();
        document.querySelector('a[href="transaction.html?v=1.0.3"]')?.closest("li")?.remove();
        document.querySelector('a[href="../Delivery/delivery.html"]')?.closest("li")?.remove();
        document.querySelector('a[href="members.html"]')?.closest("li")?.remove();
    } else if (userRole === "rider") {
        document.querySelector('a[href="http://localhost/POS-main/POS-main/POS-ims/menu.php"]')?.closest("li")?.remove();
        document.querySelector('a[href="sales.php"]')?.closest("li")?.remove();
        document.querySelector('a[href="transaction.html?v=1.0.3"]')?.closest("li")?.remove();
        document.querySelector('a[href="../InAndOut/inventoryInOut.php"]')?.closest("li")?.remove();
        document.querySelector('a[href="members.html"]')?.closest("li")?.remove();
    }

    // Logout functionality
    document.getElementById("logout").addEventListener("click", function (event) {
        event.preventDefault();
        sessionStorage.clear(); // Clear session storage
        window.location.href = "index.html"; // Redirect to login page
    });
});


function insertInfo(Amount, DateTime,ID) {
    fetch('fetchapi.php', {
        method: 'POST', // Use POST method for inserting data
        headers: {
            'Content-Type': 'application/json' // Send data as JSON
        },
        body: JSON.stringify({ // Convert JS object to JSON
            TotalAmount: Amount,
            Date: DateTime,
            CUS_ID: ID
        })
    })
    .then(response => response.json()) // Parse the JSON response
    .then(data => console.log(data.message)) // Handle success message
    .catch(error => console.error('Error:', error)); // Handle error
}

async function InsertProduct(product, price) {
    let tof = false;

    try {
        const response = await fetch('posapi.php');
        const data = await response.json();

        // Check if product already exists
        data.forEach(item => {
            if (product === item.ProductName) {
                tof = true;
            }
        });

        if (tof === false) { 
            // Product doesn't exist, insert it
            const insertResponse = await fetch('fetchapi.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ProductName: product,
                    Price: price
                })
            });
            const insertData = await insertResponse.json();
            console.log(insertData.message); // Log the success message
        } else {
            console.log('Product already exists');
        }
    } catch (error) {
        console.error('Error:', error); // Handle errors
    }
}

document.getElementById('confirm-order').addEventListener('click', function() {
    const cartItems = document.getElementById('cart-items').children;
    let orders = [];

    // Collect cart data
    Array.from(cartItems).forEach(item => {
        let name = item.dataset.name;
        let quantity = parseInt(item.dataset.quantity);

        if (name && quantity) {
            orders.push({ pname: name, change: -quantity }); // Deduct from stock
        }
    });

    if (orders.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    // Send order data to API
    fetch('api.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orders)
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert("Error: " + data.error);
        } else {
            const floatPanel = document.querySelector(".float-panel");
            floatPanel.classList.add("active"); // Expand panel

            // Wait for the expansion animation before displaying payment options
            setTimeout(() => {
                document.querySelector(".payment-container").style.display = "block";

                const totalPriceElem = document.getElementById('total-price');
                const paymentElem = document.getElementById('payment');
                const CUS = document.getElementById('customer');

                const totalPrice = parseFloat(totalPriceElem.innerText.replace('₱', '').trim());
                const payment = parseFloat(paymentElem.value.trim());
                const selectedPayment = document.querySelector('input[name="paymentmethod"]:checked').value;
                document.getElementById('confirm-order').innerText = 'Checkout';
                if (payment >= totalPrice) {
                    const change = payment - totalPrice;
                    alert(`Your total order price is: ₱${totalPrice}\nYour payment: ₱${payment}\nChange: ₱${change}`);

                    const now = new Date();
                    const formattedTime = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

                    insertInfo(totalPrice, formattedTime,CUS.value).then(salesID => {
                        InsertPayment(salesID, selectedPayment, payment, change);

                        Array.from(cartItems).forEach(item => {
                            const price = parseInt(item.dataset.price) * parseInt(item.dataset.quantity);
                            InsertProduct(item.dataset.name, parseInt(item.dataset.price),item,salesID);
                        });

                        alert("Order confirmed! Stock updated.");

                        // Clear cart
                        document.getElementById('cart-items').innerHTML = '<li>No items in cart</li>';
                        document.getElementById('total-price').innerText = '₱0.00';
                        document.getElementById('payment').value = '';

                        document.getElementById('confirm-order').innerText = 'Confirm Order';
                        

                        floatPanel.classList.remove('active');
                        floatPanel.classList.add("inactive"); 
                        document.querySelector(".payment-container").style.display = "none";

                        window.frames[0].postMessage({ type: 'order-confirmed' }, '*');

                        sendSalesIDToPython(salesID);
                        
                        Repeat();
                    });



                } else {
                    
                }
            }, 500); // Adjust delay to match CSS transition time
        }
    })
    .catch(error => console.error('Error:', error));
});



function insertInfo(Amount, DateTime,ID) {
    return fetch('fetchapi.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            TotalAmount: Amount,
            Date: DateTime,
            CUS_ID: ID
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.sales && data.sales.SalesID) {
            return data.sales.SalesID; // Return the SalesID
        } else {
            throw new Error('Failed to retrieve SalesID');
        }
    })
    .catch(error => console.error('Error:', error));
}

async function InsertProduct(product, price, item, salesID) {
    let tof = false;

    try {
        const response = await fetch('posapi.php');
        const data = await response.json();

        // Check if product already exists
        data.forEach(item => {
            if (product === item.ProductName) {
                tof = true;
            } 
        });

        if (tof === false) { 
            // Product doesn't exist, insert it
            const insertResponse = await fetch('fetchapi.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ProductName: product,
                    Price: price
                })
            });
            const insertData = await insertResponse.json();
            console.log(insertData.message); // Log the success message
        } else {
            console.log('Product already exists');
        }
    } catch (error) {
        console.error('Error:', error); // Handle errors
    }


    InsertOrder(salesID, parseInt(item.dataset.quantity), price, item.dataset.name);
}

function InsertPayment(SID,PMID,AP,CG){
    fetch('fetchapi.php', {
        method: 'POST', // Use POST method for inserting data
        headers: {
            'Content-Type': 'application/json' // Send data as JSON
        },
        body: JSON.stringify({ // Convert JS object to JSON
            SalesID: SID,
            PaymentMethodID: PMID,
            AmountPaid: AP,
            ChangeGiven: CG
        })
    })
    .then(response => response.json()) // Parse the JSON response
    .then(data => console.log(data.message)) // Handle success message
    .catch(error => console.error('Error:', error)); // Handle error
}

async function InsertOrder(SID, Q, UP, Name) {
    let PID = null;

    // Wait for the first fetch to complete and get the data
    const response = await fetch('posapi.php');
    const data = await response.json();

    // Find the matching ProductID
    data.forEach(item => {
        if (Name === item.ProductName) {
            PID = item.ProductID;
        }
    });

    console.log(`Product ID found: ${PID}`); // Debugging to check if PID is updated

    // Now that PID is correctly set, proceed with the second fetch
    const orderResponse = await fetch('fetchapi.php', {
        method: 'POST', // Use POST method for inserting data
        headers: {
            'Content-Type': 'application/json' // Send data as JSON
        },
        body: JSON.stringify({ // Convert JS object to JSON
            ProductID: PID,
            SalesID: SID,
            Quantity: Q,
            UnitPrice: UP,
            U_ProductID: PID,
            U_Quantity: Q
        }),

    });

    const orderData = await orderResponse.json(); // Parse the JSON response
    console.log(orderData.message); // Handle success message
}

function sendSalesIDToPython(salesID) {
    fetch('http://127.0.0.1:5000/generate_qr', { // Flask runs on port 5000 by default
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ salesID: salesID })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error("Error:", data.error);
        } else {
            console.log("Success:", data.message);
            alert("QR Code generated: " + data.qr_path);
        }
    })
    .catch(error => console.error('Request Failed:', error));
}

function Enter_Customers(event) {
    if (event) event.preventDefault(); // Prevents form submission if inside a form

    const First = document.getElementById("FN_Txt").value.trim();
    const Last = document.getElementById("LN_Txt").value.trim();
    const Email = document.getElementById("Email_Txt").value.trim();
    const Phone = document.getElementById("Phone_Txt").value.trim();

    if (First === "" || Last === "" || Email === "" || Phone === "") {
        alert("Please fill up all the information!");
        return;  // Stop execution
    }

    fetch('fetchapi.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            FN: First,
            LN: Last,
            PH: Phone,
            EM: Email
        })
    })
    .then(response => response.json())  // Expecting JSON response
    .then(data => {
        console.log(data.message);
        alert("Customer is Recorded!!");

        // Clear input fields for next entry
        document.getElementById("FN_Txt").value = "";
        document.getElementById("LN_Txt").value = "";
        document.getElementById("Email_Txt").value = "";
        document.getElementById("Phone_Txt").value = "";
    })
    .catch(error => {
        console.error('Error:', error);
        alert("There was an error recording the customer. Please try again.");
    });

    ProductDisplay();
}
