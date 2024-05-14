document.getElementById('qr-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const formData = new FormData(this);
    const response = await fetch('/generate-qr', {
        method: 'POST',
        body: formData
    });
    
    const result = await response.json();
    const qrPreview = document.getElementById('qr-preview');
    qrPreview.innerHTML = `<img src="${result.previewUrl}" alt="QR Code Preview">`;

    const downloadLink = document.getElementById('download-link');
    downloadLink.style.display = 'block';
    downloadLink.href = result.downloadUrl;
    downloadLink.download = result.filename;
    downloadLink.textContent = `Download as ${result.format}`;
});
