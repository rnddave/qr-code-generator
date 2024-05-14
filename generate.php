<?php
require 'vendor/autoload.php'; // Include Composer's autoloader for dependencies
use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;
use Endroid\QrCode\Writer\SvgWriter;
use Endroid\QrCode\Writer\PdfWriter;
use Endroid\QrCode\ErrorCorrectionLevel\ErrorCorrectionLevelHigh;
use Endroid\QrCode\Label\Alignment\LabelAlignmentCenter;
use Endroid\QrCode\Label\Margin\LabelMargin;
use Endroid\QrCode\Label\Font\NotoSans;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $url = $_POST['url'];
    $format = $_POST['format'];
    $uploadedFile = $_FILES['logo'];

    if (isset($url) && isset($uploadedFile)) {
        $targetDir = "uploads/";
        $targetFile = $targetDir . basename($uploadedFile["name"]);
        move_uploaded_file($uploadedFile["tmp_name"], $targetFile);

        $qrCode = new QrCode($url);
        $qrCode->setErrorCorrectionLevel(new ErrorCorrectionLevelHigh());

        $logoPath = $targetFile;
        $qrCode->setLogoPath($logoPath);
        $qrCode->setLogoSize(50, 50);

        $outputDir = 'qr-codes/';
        if (!file_exists($outputDir)) {
            mkdir($outputDir, 0777, true);
        }

        $filename = 'qr_code.' . $format;
        $filePath = $outputDir . $filename;

        switch ($format) {
            case 'png':
                $writer = new PngWriter();
                $writer->writeFile($qrCode, $filePath);
                break;
            case 'svg':
                $writer = new SvgWriter();
                $writer->writeFile($qrCode, $filePath);
                break;
            case 'pdf':
                $writer = new PdfWriter();
                $writer->writeFile($qrCode, $filePath);
                break;
        }

        // Cleanup uploaded logo
        unlink($logoPath);

        // Generate response
        $previewUrl = 'data:image/' . $format . ';base64,' . base64_encode(file_get_contents($filePath));
        $downloadUrl = 'download.php?file=' . urlencode($filePath);

        echo json_encode([
            'previewUrl' => $previewUrl,
            'downloadUrl' => $downloadUrl,
            'filename' => $filename,
            'format' => $format
        ]);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid input']);
    }
}
?>
