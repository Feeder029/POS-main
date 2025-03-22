<?php
$folder = realpath(__DIR__ . "/qrcode"); // Corrected path

if (!is_dir($folder)) {
    die("<p>Directory does not exist: $folder</p>");
}

$files = glob($folder . "/*.{jpg,jpeg,png,gif}", GLOB_BRACE);

if (!$files) {
    echo "<p>No images found in $folder</p>";
} else {
    echo "<div class='container'><h2 class='qr-title'>ITEM QR CODES</h2>";
    foreach ($files as $file) {
        $imagePath = "qrcode/" . basename($file);
        $filename = basename($file); 

        echo "<div class='image-box'>";
        echo "<img src='$imagePath' alt='Image' class='thumbnail' onclick='showImage(\"$imagePath\")'>";
        echo "<p class='image-text' onclick='showImage(\"$imagePath\")'>$filename</p>";
        echo "</div>";
    }
    echo "</div>";
}
?>

<div id="imageModal" class="modal">
    <span class="close" onclick="closeModal()">&times;</span>
    <img class="modal-content" id="modalImage">
</div>

<style>

    .container {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        flex-wrap: wrap;
        background-color: #f4f4f4;
        padding: 20px;
        position: relative;
        top: 15px;
        border-radius: 25px;
        max-height: 77vh; 
        overflow-y: auto; 
        width: 100%;
        margin: auto;
        margin-top: 0px;
        box-shadow: 2px 2px 5px rgba(0, 0, 0.5, 0.5);
        margin-bottom: auto;
        gap: 10px;
    }

    .qr-title {
        text-align: center;
        font-size: 24px;
        color: #213555;
        width: 100%;
        position: relative;
        text-shadow: 2px 2px 5px rgba(0, 0, 0.5, 0.3);
    }

    .image-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 10px;
        background-color: white;
        border-radius: 10px;
        width: 220px;
        box-shadow: 2px 2px 5px rgba(0, 0, 0.5, 0.3);
        margin: 5px;
    }


    .thumbnail {
        width: 100%;
        height: auto;
        max-width: 200px;
        cursor: pointer;
        border-radius: 5px;
        transition: transform 0.2s ease-in-out;
    }

    .thumbnail:hover {
        transform: scale(1.1);
    }


    .image-text {
        font-weight: bold;
        cursor: pointer;
        color: #213555;
        text-decoration: underline;
        text-align: center;
        font-size: 14px;
    }

    .image-text:hover{
        color: #0056b3;
    }


    .modal {
        display: none;
        position: fixed;
        z-index: 1;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        text-align: center;
    }

    .modal-content {
        display: block;
        margin: auto;
        max-width: 100%;
        max-height: 100%;
        margin-top: 5%;
        border-radius: 10px;
    }

    .close {
        position: absolute;
        top: 15px;
        right: 25px;
        color: white;
        font-size: 30px;
        cursor: pointer;
    }


    @media (max-width: 768px) {
        .container {
            width: 95%;
            padding: 10px;
        }

        .qr-title {
            width: 95%;
        }

        .image-box {
            width: 150px;
        }

        .thumbnail {
            max-width: 120px;
        }

        .image-text {
            font-size: 12px;
        }

        .close{
            top: 20%;
        }

        .modal-content{
            max-width: 70%;
            max-height: 70%;
            margin-top:40%;
        }
    }

    @media (max-width: 480px) {
        .image-box {
            width: 100px;
        }

        .thumbnail {
            max-width: 90px;
        }

        .image-text {
            font-size: 10px;
        }
    }
</style>

<script>
    function showImage(src) {
        document.getElementById("modalImage").src = src;
        document.getElementById("imageModal").style.display = "block";
    }

    function closeModal() {
        document.getElementById("imageModal").style.display = "none";
    }
</script>
