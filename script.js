document.getElementById('qr-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const url = document.getElementById('url').value;
    const logoFile = document.getElementById('logo').files[0];
    const format = document.getElementById('format').value;
    
    const qrCodeDiv = document.createElement('div');
    qrCodeDiv.id = 'qr-code';

    // Generate the QR code
    QRCode.toCanvas(qrCodeDiv, url, { errorCorrectionLevel: 'H', width: 300 }, function (error) {
        if (error) console.error(error);

        const qrCanvas = qrCodeDiv.querySelector('canvas');
        
        const context = qrCanvas.getContext('2d');
        const image = new Image();
        
        const reader = new FileReader();
        reader.onload = function(e) {
            image.onload = function() {
                const logoSize = 50;
                const x = (qrCanvas.width - logoSize) / 2;
                const y = (qrCanvas.height - logoSize) / 2;
                context.drawImage(image, x, y, logoSize, logoSize);
                
                // Convert to desired format and show preview
                let imgDataUrl;
                if (format === 'png') {
                    imgDataUrl = qrCanvas.toDataURL('image/png');
                } else if (format === 'svg') {
                    // For simplicity, we convert the canvas to PNG and then to SVG using html2canvas
                    html2canvas(qrCanvas).then(canvas => {
                        imgDataUrl = canvas.toDataURL('image/png');
                        download(imgDataUrl, `qr_code.${format}`);
                    });
                    return;
                }

                displayResult(imgDataUrl, format);
            }
            image.src = e.target.result;
        }
        reader.readAsDataURL(logoFile);
    });
});

function displayResult(imgDataUrl, format) {
    const qrPreview = document.getElementById('qr-preview');
    qrPreview.innerHTML = `<img src="${imgDataUrl}" alt="QR Code Preview">`;

    const downloadLink = document.getElementById('download-link');
    downloadLink.style.display = 'block';
    downloadLink.href = imgDataUrl;
    downloadLink.download = `qr_code.${format}`;
    downloadLink.textContent = `Download as ${format}`;
}
