document.getElementById("addProductForm").addEventListener("submit", function(event) {
    event.preventDefault();

    // Get form data
    const formData = new FormData(event.target);
    const productData = {};
    formData.forEach((value, key) => {
        productData[key] = value;
    });

    console.log("Sending data:", JSON.stringify(productData));

    fetch("http://localhost/pos-main/POS-main/InAndOut/addNewItem.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(productData)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Response:", data);

        if (data.message) {
            alert(data.message); // Show success message

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
