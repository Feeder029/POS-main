// Wait until the DOM is fully loaded fo add
document.addEventListener('DOMContentLoaded', () => {
    function ProductDisplay() {
        fetch('api.php')
            .then(response => response.json())
            .then(data => {
                let display = '';
                data.forEach(item => {
                    display += `
                        <div class="menu">
                            <div class="menu-image"></div>
                            <div class="menu-detail">
                                <h3>${item.ProductName}</h3> 
                                <p>₱${item.ProductPrice}</p>
                            </div>
                            <div class="menu-btn">
                                <button id="subtract">-</button>
                                <input type="text" value="0" readonly />
                                <button id="add">+</button>
                            </div>
                        </div>`;
                }); //Display Code

                //Add the display to the html
                document.getElementById('menu').innerHTML = display;

                // Call function to attach event listeners
                attachEventListeners();
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    function attachEventListeners() {
        document.querySelectorAll('.menu-btn').forEach(menuBtn => {
            const inputField = menuBtn.querySelector('input');
            const addBtn = menuBtn.querySelector('#add');
            const subtractBtn = menuBtn.querySelector('#subtract');
            const itemDetail = menuBtn.closest('.menu').querySelector('.menu-detail');
            const itemName = itemDetail.querySelector('h3').innerText;
            const itemPrice = parseFloat(itemDetail.querySelector('p').innerText.replace('₱', '').trim());

            console.log(`Attaching event listeners to: ${itemName}`);

            // Initialize input field value
            inputField.value = 0;

            // Add button click event
            addBtn.addEventListener('click', () => {
                inputField.value = parseInt(inputField.value) + 1;
                console.log(`Added: ${itemName} | New Quantity: ${inputField.value}`);

                // Send message to parent window (dashboard)
                window.parent.postMessage({
                    type: 'add-to-cart',
                    name: itemName,
                    price: itemPrice
                }, '*');
            });

            // Subtract button click event
            subtractBtn.addEventListener('click', () => {
                if (parseInt(inputField.value) > 0) {
                    inputField.value = parseInt(inputField.value) - 1;
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
                }
            });
        });
    }

    // Call ProductDisplay to fetch and display products
    ProductDisplay();
});
