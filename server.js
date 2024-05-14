// server.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const qrcode = require('qrcode');
const sharp = require('sharp');
const { createCanvas, loadImage } = require('canvas');
const pdf = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));

app.post('/generate-qr-code', upload.single('logo'), async (req, res) => {
  const url = req.body.url;
  const logoPath = req.file.path;

  try {
    const qrCodeData = await qrcode.toDataURL(url);
    const qrCodeImage = await loadImage(Buffer.from(qrCodeData.split(',')[1], 'base64'));

    const logoImage = await loadImage(logoPath);
    const canvasWidth = qrCodeImage.width;
    const canvasHeight = qrCodeImage.height;
    const logoSize = Math.min(canvasWidth / 4, canvasHeight / 4);

    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(qrCodeImage, 0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(logoImage, canvasWidth / 2 - logoSize / 2, canvasHeight / 2 - logoSize / 2, logoSize, logoSize);

    const buffer = canvas.toBuffer('image/png');
    res.set('Content-Type', 'image/png');
    res.send(buffer);
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).send('Error generating QR code');
  } finally {
    fs.unlinkSync(logoPath);
  }
});

app.get('/download-qr-code', async (req, res) => {
    const format = req.query.format;
  
    try {
      const qrCodeData = await qrcode.toDataURL('https://example.com');
      const qrCodeImage = await loadImage(Buffer.from(qrCodeData.split(',')[1], 'base64'));
  
      const logoImage = await loadImage('path/to/your/logo.png');
      const canvasWidth = qrCodeImage.width;
      const canvasHeight = qrCodeImage.height;
      const logoSize = Math.min(canvasWidth / 4, canvasHeight / 4);
  
      const canvas = createCanvas(canvasWidth, canvasHeight);
      const ctx = canvas.getContext('2d');
  
      ctx.drawImage(qrCodeImage, 0, 0, canvasWidth, canvasHeight);
      ctx.drawImage(logoImage, canvasWidth / 2 - logoSize / 2, canvasHeight / 2 - logoSize / 2, logoSize, logoSize);
  
      if (format === 'png') {
        res.set('Content-Type', 'image/png');
        res.set('Content-Disposition', 'attachment; filename="qr-code.png"');
        canvas.createPNGStream().pipe(res);
      } else if (format === 'pdf') {
        res.set('Content-Type', 'application/pdf');
        res.set('Content-Disposition', 'attachment; filename="qr-code.pdf"');
  
        const pdfDoc = await pdf.PDFDocument.create();
        const pdfBytes = await pdfDoc.embedPng(canvas.toBuffer());
        const pdfImage = await pdfDoc.embedPng(pdfBytes);
        const page = pdfDoc.addPage();
        page.drawImage(pdfImage, {
          x: 0,
          y: 0,
          width: page.getWidth(),
          height: page.getHeight(),
        });
  
        const pdfBytes = await pdfDoc.save();
        res.end(pdfBytes);
      } else if (format === 'svg') {
        res.set('Content-Type', 'image/svg+xml');
        res.set('Content-Disposition', 'attachment; filename="qr-code.svg"');
  
        const svgData = canvas.toDataURL('image/svg+xml');
        res.send(svgData.slice(svgData.indexOf(',') + 1));
      } else {
        res.status(400).send('Invalid format');
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
      res.status(500).send('Error generating QR code');
    }
  });
  
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });