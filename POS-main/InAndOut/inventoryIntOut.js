document.getElementById("addProductForm").addEventListener("submit", function(event) {
    event.preventDefault();

    // Get form data
    const formData = new FormData(event.target);
    const productData = {};
    formData.forEach((value, key) => {
        productData[key] = value;
    });

    console.log("Sending data:", JSON.stringify(productData));

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
        alert(data.message); 
        console.log("Response:", data);

        if (data.message) {
            alert(data.message); // Show success message
            // Call the function when needed
            addProduct();


            // Reset form fields
            event.target.reset();

            // Close the form
            document.getElementById("add-new-container").hidePopover(); 
        } else {
            alert(data.error); // Show error if any
        }
    })
    .catch(error => console.error("Error:", error));
});

function addProduct() {
    const productData = {
        name: "Sample Product",
        price: 99.99,
        quantity: 10
    };

    fetch("additem.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(productData)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Response from PHP:", data);

        if (data.success) {
            alert("Product successfully added to the database!");
        } else {
            alert("PHP Error: " + data.error);
        }
    })
    .catch(error => console.error("PHP Error:", error));
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