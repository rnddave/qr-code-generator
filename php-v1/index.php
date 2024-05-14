<!DOCTYPE html>
<html>
<head>
    <title>QR Code Generator</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 20px;
        }
        input[type="text"] {
            padding: 5px;
            font-size: 16px;
            width: 300px;
        }
        button {
            padding: 5px 10px;
            font-size: 16px;
        }
        img {
            max-width: 300px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <h1>QR Code Generator</h1>
    <form method="get" action="qr-generator.php">
        <label for="url">Enter a URL:</label>
        <input type="text" id="url" name="url" placeholder="https://www.example.com">
        <button type="submit">Generate QR Code</button>
    </form>

    <?php
    if (isset($_GET['url'])) {
        $url = $_GET['url'];
        echo "<img src=\"qr-generator.php?url=$url\" alt=\"QR Code\">";
    }
    ?>
</body>
</html>