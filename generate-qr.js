const express = require('express');
const multer = require('multer');
const QRCode = require('qrcode');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));

app.post('/generate-qr', upload.single('logo'), async (req, res) => {
    const { url } = req.body;
    const logoPath = req.file.path;
    
    try {
        // Resize logo
        const logoBuffer = await sharp(logoPath).resize(50, 50).toBuffer();
        const logoBase64 = logoBuffer.toString('base64');
        
        // Generate QR code
        const qrOptions = {
            errorCorrectionLevel: 'H',
            type: 'png',
            quality: 0.92,
            margin: 1,
            color: {
                dark: '#000000',
                light: '#ffffff'
            }
        };

        const qrCodeData = await QRCode.toDataURL(url, qrOptions);
        const qrImageBuffer = Buffer.from(qrCodeData.split(',')[1], 'base64');
        
        // Add logo to QR code
        const qrWithLogo = await sharp(qrImageBuffer)
            .composite([{ input: logoBuffer, gravity: 'center' }])
            .toBuffer();

        const previewUrl = `data:image/png;base64,${qrWithLogo.toString('base64')}`;
        
        // Save QR code as file
        const outputFormat = 'png'; // Can be 'png', 'pdf', or 'svg' based on user choice
        const outputFilename = `qr-code.${outputFormat}`;
        await sharp(qrWithLogo).toFile(path.join('public', outputFilename));
        
        res.json({
            previewUrl,
            downloadUrl: `/${outputFilename}`,
            filename: outputFilename,
            format: outputFormat
        });
    } catch (error) {
        res.status(500).send({ error: 'QR Code generation failed' });
    } finally {
        // Clean up uploaded logo file
        fs.unlinkSync(logoPath);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
