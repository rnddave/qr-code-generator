// script.js
const form = document.getElementById('qrForm');
const logoInput = document.getElementById('logo');
const logoPreview = document.getElementById('logoPreview');
const qrCodeImage = document.getElementById('qrCodeImage');
const downloadPNG = document.getElementById('downloadPNG');
const downloadPDF = document.getElementById('downloadPDF');
const downloadSVG = document.getElementById('downloadSVG');

logoInput.addEventListener('change', () => {
  const file = logoInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      logoPreview.src = reader.result;
      logoPreview.style.display = 'inline-block';
    };
    reader.readAsDataURL(file);
  }
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const url = document.getElementById('url').value;
  const logo = logoInput.files[0];

  const formData = new FormData();
  formData.append('url', url);
  formData.append('logo', logo);

  try {
    const response = await fetch('/generate-qr-code', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      qrCodeImage.src = imageUrl;
    } else {
      console.error('Error generating QR code:', response.statusText);
    }
  } catch (error) {
    console.error('Error:', error);
  }
});

downloadPNG.addEventListener('click', async () => {
  try {
    const response = await fetch('/download-qr-code?format=png');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qr-code.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error:', error);
  }
});

downloadPDF.addEventListener('click', async () => {
  try {
    const response = await fetch('/download-qr-code?format=pdf');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qr-code.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error:', error);
  }
});

downloadSVG.addEventListener('click', async () => {
  try {
    const response = await fetch('/download-qr-code?format=svg');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qr-code.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error:', error);
  }
});