<?php
require 'vendor/autoload.php';

use Endroid\QrCode\Color\Color;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\ErrorCorrectionLevel\ErrorCorrectionLevelLow;
use Endroid\QrCode\QrCode;
use Endroid\QrCode\Label\Label;
use Endroid\QrCode\Logo\Logo;
use Endroid\QrCode\RoundBlockSizeMode\RoundBlockSizeModeMargin;
use Endroid\QrCode\Writer\PngWriter;

// Get the URL from the user input (you can replace this with your own method of obtaining the URL)
$url = isset($_GET['url']) ? $_GET['url'] : 'https://www.example.com';

// Create a basic QR code
$qrCode = new QrCode($url);
$writer = new PngWriter();

// Customize the QR code
$qrCode
    ->setErrorCorrectionLevel(new ErrorCorrectionLevelLow())
    ->setRoundBlockSizeMode(new RoundBlockSizeModeMargin())
    ->setForegroundColor(new Color(0, 0, 0))
    ->setBackgroundColor(new Color(255, 255, 255))
    ->setLabel('My QR Code')
    ->setLogoPath(__DIR__ . '/logo.png');

// Save the QR code as a PNG image
$result = $writer->write($qrCode);
header('Content-Type: ' . $result->getMimeType());
echo $result->getString();