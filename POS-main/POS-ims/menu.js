document.addEventListener('DOMContentLoaded', async () => {
    let product_deduction = new Map();

    await GetData(); // Ensure GetData completes before proceeding
    ProductDisplay();

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

    function ProductDisplay() {
        fetch('api.php')
            .then(response => response.json())
            .then(data => {
                let display = '';

                data.forEach(item => {
                    let val = 0;

                    product_deduction.forEach((value, key) => {
                        // console.log(key + " : " + value);
                            if(item.ProductName == key && value != null){
                                val = value;
                            };
                    });
                          
                    display += `
                        <div class="menu">
                            <div class="menu-image"></div>
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
                    alert("Not enough stock available!");
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
                    alert("Quantity is Zero!"); // Alert user if they try to subtract below 0
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
    ProductDisplay();
});
