document.addEventListener('DOMContentLoaded', function() {
    const urlInput = document.getElementById('url');
    const logoInput = document.getElementById('logo');
    const formatSelect = document.getElementById('format');
    const generateButton = document.getElementById('generate-btn');

    urlInput.addEventListener('input', updateQRCode);
    logoInput.addEventListener('change', updateQRCode);
    generateButton.addEventListener('click', generateQRCode);

    function updateQRCode() {
        const url = urlInput.value;
        const logoFile = logoInput.files[0];

        if (!url || !logoFile) {
            return;
        }

        const qrCodeDiv = document.createElement('div');
        qrCodeDiv.id = 'qr-code';

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

                    const imgDataUrl = qrCanvas.toDataURL('image/png');
                    displayPreview(imgDataUrl);
                }
                image.src = e.target.result;
            }
            reader.readAsDataURL(logoFile);
        });
    }

    function displayPreview(imgDataUrl) {
        const qrPreview = document.getElementById('qr-preview');
        qrPreview.innerHTML = `<img src="${imgDataUrl}" alt="QR Code Preview" style="max-width: 100%; height: auto;">`;
    }

    function generateQRCode() {
        const url = urlInput.value;
        const logoFile = logoInput.files[0];
        const format = formatSelect.value;

        if (!url || !logoFile) {
            alert("Please provide a URL and a logo image.");
            return;
        }

        const qrCodeDiv = document.createElement('div');
        qrCodeDiv.id = 'qr-code';

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

                    let imgDataUrl;
                    if (format === 'png') {
                        imgDataUrl = qrCanvas.toDataURL('image/png');
                    } else if (format === 'svg') {
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
    }

    function displayResult(imgDataUrl, format) {
        displayPreview(imgDataUrl);

        const downloadLink = document.getElementById('download-link');
        downloadLink.style.display = 'block';
        downloadLink.href = imgDataUrl;
        downloadLink.download = `qr_code.${format}`;
        downloadLink.textContent = `Download as ${format}`;
    }
});
