<?php
$servername = "localhost";
$username = "root";
$password = "";

try {
    $conn = new PDO("mysql:host=$servername;dbname=pos_db", $username, $password);
    // set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // echo "Connected successfully"; // You can remove this line once you verify the connection
} catch(PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}

$sql = "SELECT prodName AS ProductName, prodPrice AS ProductPrice FROM producttable";
$stmt = $conn->prepare($sql);
$stmt->execute();

// Fetch all products from the database
$products = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="menu.css">
    <title>Product Menu</title>
</head>
<body>
    <nav class="navbar">
        <div class="bot-nav">            
            <div class="category-container">
                <h3>Categories</h3>
                <ul>
                    <li><button>All</button></li>
                    <li><button>cat1</button></li>
                    <li><button>cat2</button></li>
                    <li><button>cat3</button></li>
                </ul>
            </div>
        </div>
    </nav>


        <div class="menu-container" id="menu"> 
            

    
        </div>

    <script src="menu.js"></script>
</body>
</html>
