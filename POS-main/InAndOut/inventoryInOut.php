<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>INVENTORY IN & OUT</title>
    <link rel="stylesheet" href="inventoryInOut.css?v=1.0.4">
</head>
<body>
    <nav>
        <button id="add-product-main" popovertarget="add-container" type="button">ADD PRODUCT</button>
        <button id="deduct-product-main" popovertarget="deduct-product" type="button">DEDUCT PRODUCT</button>
    </nav>

    <div id="add-container" popover>
        <div class="scan-qr"> <h1>Scan QR</h1>
            <button class="add-product" popovertarget="add-product"  onclick="closeAddContainer()">ADD PRODUCT AMOUNT</button>
        </div>
        <div class="fillup-form"> <h1>Form</h1>
            <button popovertarget="add-new-container"  onclick="closeAddContainer()">ADD NEW PRODUCT</button>
        </div>
        <button id="back-add-container" onclick="back()">BACK</button>
    </div>

    <div id="add-product" popover >
        <div class="scan-container">
            <h1>SCAN THE QR</h1>
            <button id="start-scan-add">Start QR Scan</button>
            <p id="qr-result-add">Waiting for scan...</p>
            <button onclick="closeQR()">CLOSE</button>
        </div>
        
    </div>

    <div id="deduct-product" popover>
        <div class="scan-container">
            <h1>SCAN THE QR</h1>
            <button id="start-scan-deduct">Start QR Scan</button>
            <p id="qr-result-deduct">Waiting for scan...</p>
            <button onclick="closeQR()">CLOSE</button>
        </div>   
    </div>
    
    
    
    <div id="add-quantity" style="display:none;">
        <h1 id="product-name-add">ITEM NAME</h1>
        <h1>ADD QUANTITY</h1>
        <input type="number" name="add-quantity-input" id="add-quantity-input">
        <button onclick="updateQuantity1()">ADD</button> <!-- Call JS function -->
    </div>

    <div id="deduct-quantity" style="display:none;">
        <h1 id="product-name-deduct">ITEM NAME</h1>
        <h1>DEDUCT QUANTITY</h1>
        <input type="number" name="deduct-quantity-input" id="deduct-quantity-input">
        <button onclick="updateQuantity2()">DEDUCT</button> <!-- Call JS function -->
    </div>
    
    


    <div id="add-new-container" popover>
        <div class="main-form-container">
            <form id="addProductForm">
                <select name="category" id="category" required>
                    <option value="0">Select Category</option>
                    <option value="1">Random Item</option>
                    <option value="2">Smartphone</option>
                    <option value="3">Speaker</option>
                </select>
                <select name="brand" id="brand" required>
                    <option value="">Select Brand</option>
                    <option value="1">Brand 1</option>
                    <option value="2">Brand 2</option>
                    <option value="3">Brand 3</option>
                </select>
                <input type="text" name="product_name" id="product-name" placeholder="Product Name" required>
                <input type="text" name="product_model" id="product-model" placeholder="Product Model" required>
                <textarea name="description" id="description" cols="20" rows="10" placeholder="Description" required></textarea>
                <input type="text" name="quantity" id="quantity" placeholder="quantity">
                <select name="unit" id="unit" required>
                    <option value="">Select Unit</option>
                    <option value="Bags">Bags</option>
                    <option value="Bottles">Bottles</option>
                    <option value="Box">Box</option>
                    <option value="Dozens">Dozens</option>
                    <option value="Feet">Feet</option>
                    <option value="Gallons">Gallons</option>
                    <option value="Gram">Gram</option>
                    <option value="Inch">Inch</option>
                    <option value="Kg">Kg</option>
                    <option value="Liters">Liters</option>
                    <option value="Meters">Meters</option>
                    <option value="Nos">Nos</option>
                    <option value="Packet">Packet</option>
                    <option value="Rolls">Rolls</option>
                </select>
                <input type="number" name="base_price" id="base_price" placeholder="Base Price" required>
                <input type="number" name="product_tax" id="product_tax" placeholder="Product Tax" required>
                <select name="supplier" id="supplier" required>
                    <option value="">Select Supplier</option>
                    <option value="1">Supplier 101</option>
                    <option value="2">Supplier 102</option>
                    <option value="3">Supplier 103</option>
                </select>
                <button class="submit-btn" type="submit">SUBMIT</button>
            </form>
            
            <button class="close-btn" popovertarget="add-new-container" popovertargetaction="hide">CLOSE</button>
        </div>
    </div>


    <script src="inventoryIntOut.js?v=1.2"></script>
</body>
</html>
