<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="delivery.css?v=1.4">
    <title>DELIVERY</title>
</head>
<body>
    <div id="title">
        <h1>DELIVERY</h1>
    </div>

    <div class="main-container">
       
        <div class="scan-qr" style="visibility: visible;">
            <div class="scan-container">
                    <h1>SCAN THE QR</h1>
                    <button id="start-scan">Start QR Scan</button>
                    <p id="qr-result">Waiting for scan...</p>
                    <!-- <div class="close-btn" id="close">
                        <button onclick="closeQR()">CLOSE</button>
                    </div> -->
            </div>
        </div>

        <div class="delivered-list">
            <div class="table-container">  
                <table>
                    <thead>
                        <tr>
                            <th>ORID</th>
                            <th>STATUS</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php include 'ORStatus.php'; ?>
                    </tbody>
                </table>
            </div>
        </div>

    </div>
        <div id="container" popover >
            <div class="child-container">
                <div class="h1">  <h1>SALES ID</h1></div>
                    <div class="container-btn">
                        <button id="Show-receipt" onclick="showReceipt()" popovertarget="receipt">SHOW RECEIPT</button>
                        <button id="confirm-btn" onclick="confirmDelivery()">CONFIRM DELIVERY</button>
                    </div>
            </div>  
           
        </div>
    
        <div id="receipt" popover >
            <div>
                <h1>Receipt</h1>
            </div>
            <div class="close-btn" id="close">
                <button onclick="closeQR()" popovertarget="receipt" popovertargetaction="hide">CLOSE</button>
            </div>
        </div>
    
    <script src="delivery.js?v=1.0.4"></script>
</body>
</html>