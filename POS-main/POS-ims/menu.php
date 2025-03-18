<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="menu.css?v=1.0.4">
    <title>Product Menu</title>
    


</head>
<body>
    <div class="main-container">
        <nav class="navbar">
           <div class="product-label"> 
                <h1>Products</h1>
            </div>
    
            <div class="category-container">
                <div class="category-label">

                <div class="category-label">
                <div><a onclick="ProductDisplay(0); setActive(this)" class="active" data-category="all">All</a></div>
                <div><a onclick="ProductDisplay(1); setActive(this)">Bicycles</a></div>
                <div><a onclick="ProductDisplay(2); setActive(this)">Accessories</a></div>
                <div><a onclick="ProductDisplay(3); setActive(this)">Maintenance & Tools</a></div>
                </div>

                </div>
            </div>
        </nav>
    <div class="menu-n-cart-container">
        <div class="menu-container" id="menu"> 
            
        </div>
    </div>

</div>
    <div class="cart-containers">
    </div>
       
    <script src="menu.js?v=1.7"></script>

    
</body>
</html>
