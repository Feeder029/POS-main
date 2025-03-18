document.addEventListener('DOMContentLoaded', async () => {
    let product_deduction = new Map();

    await GetData(); // Ensure GetData completes before proceeding
    ProductDisplay(0);

    async function GetData() {
        try {
            let response = await fetch('posapi.php');
            let data = await response.json();

            data.forEach(item => {
                product_deduction.set(item.ProductName, item.Temp_Sales);
            });

            console.log("Product Deduction Loaded:", [...product_deduction.entries()]);
        } catch (error) {
            console.error('Error fetching posapi.php data:', error);
        }
    }


    // function Bicycle() {
    //     alert("Bicycle function executed!"); // Debugging output
    //     ProductDisplay(1);
    // }
    
    // Ensure it's globally accessible
    window.ProductDisplay = ProductDisplay;

    function ProductDisplay(catID) {
        fetch('api.php')
            .then(response => response.json())
            .then(data => {
                let display = '';

                data.forEach(item => {
                    let val = 0;

                      // Define images for specific products
                    let productImages = {
                        "Road Bike": "../img/roadbike.jpg",
                        "BMX Frame": "../img/bmxframe.jpg",
                        "City Ride": "../img/citybike.jpg",
                        "Tour Cycle": "../img/touringbike.jpg",
                        "MTB Frame": "../img/mtbframe.jpg",
                        "Bell Horn": "../img/bellhorn.jpg",
                        "Bike Lock": "../img/bikelock.jpg",
                        "Rear Rack": "../img/rearrack.jpg",
                        "Grip Tape": "../img/griptape.jpg",
                        "Water Cage": "../img/bottlecage.webp",
                        "Chain Lube": "../img/chainlube.webp",
                        "Tire Pump": "../img/tirepump.jpg",
                        "Hex Wrench": "../img/hexwrench.webp",
                        "Rim Strip": "../img/rim strip.jpg",
                        "Brake Pads": "../img/brakepads.jpg",
                        "Gear Grease": "../img/geargrease.jpg",
                        "brake": "../img/brake.jpg"
                    };

                    // Assign the image based on product name, or use a default image
                    let productImage = productImages[item.ProductName] || "default.jpg";

                    if(item.categoryid==catID||catID==0){
                        product_deduction.forEach((value, key) => {
                            // console.log(key + " : " + value);
                                if(item.ProductName == key && value != null){
                                    val = value;
                                };
                        });

                        display += `
                        <div class="menu">
                            <div class="menu-image">
                                <img src="images/${productImage}" alt="${item.ProductName}" />
                            </div>
                            <div class="menu-detail">
                                <h3>${item.ProductName}</h3> 
                                <p>₱${item.ProductPrice}</p>
                                <p>Stock: <span class="stock-count">${item.Stock-val}</span></p>
                            </div>
                            <div class="menu-btn">
                                <button id="subtract">-</button>
                                <input type="text" value="0" readonly id="item-count"/>
                                <button id="add">+</button>
                            </div>
                        </div>`;
                    }     

                });

                //Add the display to the HTML
                document.getElementById('menu').innerHTML = display;

                // Call function to attach event listeners
                attachEventListeners();
            })
            .catch(error => console.error('Error fetching api.php data:', error));
    }

   

    function updateStock(pname, change, stockElement) {
        // Update the stock display directly in the UI without making any database changes
        let currentStock = parseInt(stockElement.innerText);
        let newStock = currentStock + change;
        
        // Only update the display if the stock is not going below 0
        if (newStock >= 0) {
            stockElement.innerText = newStock; // Update stock display
        } else {
            alert('Not enough stock available!');
        }
    }

    function attachEventListeners() {
        document.querySelectorAll('.menu-btn').forEach(menuBtn => {
            const inputField = menuBtn.querySelector('input');
            const addBtn = menuBtn.querySelector('#add');
            const subtractBtn = menuBtn.querySelector('#subtract');
            const itemDetail = menuBtn.closest('.menu').querySelector('.menu-detail');
            const itemName = itemDetail.querySelector('h3').innerText;
            const itemPrice = parseFloat(itemDetail.querySelector('p').innerText.replace('₱', '').trim());
            const stockElement = itemDetail.querySelector('.stock-count');
            console.log(`Attaching event listeners to: ${itemName}`);

            // Initialize input field value
            inputField.value = 0;

            // Add button click event
            addBtn.addEventListener('click', () => {
                if (parseInt(stockElement.innerText) > 0) {
                    inputField.value = parseInt(inputField.value) + 1;
                    console.log(`Added: ${itemName} | New Quantity: ${inputField.value}`);
                    updateStock(itemName, -1, stockElement); // Subtract from stock

                    // Send message to parent window (dashboard)
                    window.parent.postMessage({
                        type: 'add-to-cart',
                        name: itemName,
                        price: itemPrice
                    }, '*');
                } else {
                    Swal.fire({
                        title: "Out of Stack!",
                        text: "Not enough stock available!",
                        icon: "warning",
                        confirmButtonText: "OK"
                    });                    
                }          
            });

            // Subtract button click event
            subtractBtn.addEventListener('click', () => {
                if (parseInt(inputField.value) > 0) {
                    inputField.value = parseInt(inputField.value) - 1;
                    updateStock(itemName, 1, stockElement);
                    console.log(`Subtracted: ${itemName} | New Quantity: ${inputField.value} ${itemPrice}`);

                    if (parseInt(inputField.value) === 0) {
                        window.parent.postMessage({
                            type: 'remove-from-cart',
                            name: itemName,
                            price: itemPrice
                        }, '*');
                    } else {
                        window.parent.postMessage({
                            type: 'update-quantity',
                            name: itemName,
                            price: itemPrice,
                            quantity: inputField.value
                        }, '*');
                    }
                } else {
                    Swal.fire({
                        toast: true,
                        position: "top-start",
                        icon: "error",
                        title: "Quantity is Zero!",
                        showConfirmButton: false,
                        timer: 3000
                    });
                }
            });
        });
    }

    window.addEventListener('message', function(event) {
        if (event.data.type === 'order-confirmed') {
            // Reset the quantity inputs in the menu to 0
            document.querySelectorAll('.menu-btn input').forEach(input => {
                input.value = 0;
            });
        }
    });

    // Call ProductDisplay to fetch and display products
    ProductDisplay(0);
});


function setActive(clickedElement) {
    // Remove "active" class from all links
    document.querySelectorAll(".category-label a").forEach(el => {
        el.classList.remove("active");
    });

    // Add "active" class to the clicked link
    clickedElement.classList.add("active");
}

document.addEventListener("DOMContentLoaded", function () {
    document.querySelector(".category-label a").classList.add("active");
});


document.addEventListener("DOMContentLoaded", function() {
    const categoryLinks = document.querySelectorAll(".category-label a");

    categoryLinks.forEach(link => {
        link.addEventListener("click", function(event) {
            event.preventDefault(); // Prevent default navigation behavior

            // Remove 'active' class from all links
            categoryLinks.forEach(l => l.classList.remove("active"));

            // Add 'active' class to the clicked link
            this.classList.add("active");
        });
    });
});
