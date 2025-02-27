<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>INVENTORY IN & OUT</title>
    <link rel="stylesheet" href="inventoryInOut.css">
</head>
<body>
    <button popovertarget="add-container">ADD PRODUCT</button>

    <div id="add-container" popover>
        <button popovertarget="add-product">ADD PRODUCT AMOUNT</button>
        <button popovertarget="add-new-container">ADD NEW PRODUCT</button>
    </div>

    <div id="add-product" popover>
        <h1>SCAN THE QR</h1>
        <button id="start-scan">Start QR Scan</button>
        <p id="qr-result">Waiting for scan...</p>
    </div>


    <div id="add-new-container" popover>
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
            <button type="submit">SUBMIT</button>
        </form>
        
        <button popovertarget="add-new-container" popovertargetaction="hide">CLOSE</button>
    </div>

    <script src="inventoryIntOut.js?v=1.0.2"></script>
</body>
</html>
