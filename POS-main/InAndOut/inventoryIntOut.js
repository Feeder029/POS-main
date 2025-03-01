document.getElementById("add-product-main").addEventListener("click", function(event) {
    document.getElementById("add-container").showPopover();

    document.getElementById("add-container").style.display = "block";
    document.getElementById("add-container").style.display = "flex";
});


function back(){
    document.getElementById("add-container").style.display = "none";
}

function closeAddContainer(){
    document.getElementById("add-container").style.display = "none";
}

document.getElementById("addProductForm").addEventListener("submit", function(event) {
    event.preventDefault();

    // Get form data
    const formData = new FormData(event.target);
    const productData = {};
    formData.forEach((value, key) => {
        productData[key] = value;
    });

    console.log("Sending data:", JSON.stringify(productData));

    // Step 1: Send data to Flask API
    fetch("http://127.0.0.1:5000/add-product", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(productData)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Response from Python:", data);

        if (data.message) {
            alert("Python API: " + data.message); // Show success message

            // Step 2: After Flask API, send data to PHP script
            document.getElementById("add-new-container").hidePopover();
            return sendToPHP(productData);
        } else {
            throw new Error(data.error || "Unknown error from Python API");
        }
    })
    .then(data => {
        console.log("Response from PHP:", data);
        if (data.success) {
            alert("PHP: " + data.message);

            // Reset form fields
            event.target.reset();

            // Close the form
            document.getElementById("add-new-container").hidePopover();
        } else {
            alert("PHP Error: " + data.error);
        }
    })
    .catch(error => console.error("Error:", error));
});

// Function to send data to PHP script
function sendToPHP(productData) {
    return fetch("http://localhost/pos-main/POS-main/InAndOut/addNewItem.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(productData)
    })
    .then(response => response.json());
}


document.getElementById("start-scan").addEventListener("click", function() {
    fetch("http://127.0.0.1:5000/start-scan")
    .then(response => response.json())
    .then(data => {
        document.getElementById("qr-result").textContent = data.message;
    })
    .catch(error => {
        console.error("Error:", error);
        document.getElementById("qr-result").textContent = "Failed to start scanning.";
    });
});
let stopFetching = false;
let intervalID = setInterval(updateProductName, 2000);
function updateProductName() {
    if (stopFetching) return;
    fetch("http://localhost:5000/api/get-scanned-data")
    .then(response => response.json())
    .then(data => {
        console.log("Received Data:", data);

        if (data.product_name) {
            document.querySelector("#add-quantity h1").textContent = data.product_name;
            document.getElementById("add-quantity").style.display = "block";
            document.getElementById("add-product").style.display = "none";
        } else {
            console.error("Error: product_name not found in response.");
        }
    })
    
}

// Refresh the product name every 2 seconds
setInterval(updateProductName, 2000);
console.log("Product Name:", data.product_name);

function updateQuantity() {
   
    let productName = document.getElementById("product-name").textContent; // Get product name
    let quantity = document.getElementById("add-quantity-input").value; // Get input value

    if (!quantity || isNaN(quantity) || quantity <= 0) {
        alert("Please enter a valid quantity.");
        return;
    }

    let data = {
        product_name: productName,
        quantity: parseInt(quantity)
    };

    fetch("http://localhost/pos-main/POS-main/InAndOut/updateQuantity.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
            document.getElementById("add-quantity").style.display = "none";
            document.getElementById("add-quantity-input").value = ""; // Clear input
            stopFetching = true;
            clearInterval(intervalID);
            fetch("http://localhost:5000/api/reset-scanned-data", { method: "POST" })
                .catch(error => console.error("Error resetting scan:", error));
        } else {
            alert("Error: " + data.error);
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });
}
