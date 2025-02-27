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