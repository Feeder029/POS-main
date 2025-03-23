<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>INVENTORY IN & OUT</title>
    <link rel="stylesheet" href="inventoryInOut.css?v=1.0.9">
</head>
<body>
    <div class="main-container">
        <nav>
            <h1>IN AND OUT</h1>
            <div class="nav-btn">
                <button id="add-product-main" popovertarget="add-container" type="button">ADD PRODUCT</button>
                <button id="deduct-product-main" popovertarget="deduct-product" type="button">DEDUCT PRODUCT</button>
            </div>
        </nav>
   
        <div class="item-folder">
            <?php include "../InAndOut/qrlist.php"; ?>
        </div>
        
        <div class="child-main-container">
            <div id="add-quantity" style="display:none;">
                <div class="main-add-quantity-container">
                    <div class="make-label-center"> 
                        <h1 id="product-name-add">ITEM NAME</h1>
                            <h2>ADD QUANTITY</h2>
                    </div>
                    <div class="make-textbox-center">
                        <input type="number" name="add-quantity-input" id="add-quantity-input">
                        <button class="add-btn" onclick="updateQuantity1()">ADD</button> <!-- Call JS function -->
                    </div>
                </div>
            </div>

            <div id="deduct-quantity" style="display:none;">
                <div class="main-deduct-quantity-container">
                  <div class="make-label-center">
                    <h1 id="product-name-deduct">ITEM NAME</h1>
                    <h2>DEDUCT QUANTITY</h2>
                  </div>
                   <div class="make-textbox-center">
                    <input type="number" name="deduct-quantity-input" id="deduct-quantity-input">
                    <button class="deduct-btn" onclick="updateQuantity2()">DEDUCT</button> <!-- Call JS function -->
                   </div>
                </div>
            </div>
        </div>
    </div>

   

        <div id="add-container" popover>
        <div class="semi-add-container">
                <div class="add-container-child">
                        <div class="scan-qr"> <h1>Scan QR</h1>
                            <button class="add-product" popovertarget="add-product"  onclick="closeAddContainer()">ADD PRODUCT AMOUNT</button>
                        </div>
                        <div class="fillup-form"> <h1>Form</h1>
                            <button popovertarget="add-new-container"  onclick="closeAddContainer()">ADD NEW PRODUCT</button>
                        </div>
                </div>

                <div class="back-btn-container">
                    <button id="back-add-container" onclick="back()">CLOSE</button>
                </div>
            </div>
        </div>  
    
        
    <div id="add-product" popover >
        <div class="add-product-main-container">
            <div class="scan-container">
                <h1>SCAN THE QR</h1>
                <button id="start-scan-add">Start QR Scan</button>
                <p id="qr-result-add">Waiting for scan...</p>
                <div class="close-btn" id="close">
                    <button onclick="closeQR()">CLOSE</button>
                </div>
            </div>
        </div>
    </div>

    <div id="deduct-product" popover>
        <div class="scan-container">
            <h1>SCAN THE QR</h1>
            <button id="start-scan-deduct">Start QR Scan</button>
            <p id="qr-result-deduct">Waiting for scan...</p>
                <div class="close-btn">
                    <button onclick="closeQR()">CLOSE</button>
                </div>
        </div>   
    </div>
    
    <div id="add-new-container" popover>
        <div class="main-form-container">
            <form id="addProductForm">
                <h2>ADD Product</h2>
                <select name="category" id="category" required>
                    <option value="0">Select Category</option>
                    <option value="1">Bicycles</option>
                    <option value="2">Accessories</option>
                    <option value="3">Maintenance & Tools</option>
                </select>
                <select name="brand" id="brand" required>
                    <option value="">Select Brand</option>
                    <option value="1">Shimano</option>
                    <option value="2">Trek</option>
                    <option value="3">Giant</option>
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
                    <option value="1">RideGear Distributors</option>
                    <option value="2">Cycling Hub Supplies</option>
                    <option value="3">BikeWorld Trading</option>
                </select>
                <button class="submit-btn" type="submit">SUBMIT</button>
            </form>
            
            <button class="form-close-btn" popovertarget="add-new-container" popovertargetaction="hide">CLOSE</button>
        </div>
    </div>


    <script src="inventoryIntOut.js?v=1.2"></script>
</body>
</html>
