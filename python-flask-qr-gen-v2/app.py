from flask import Flask, request, jsonify, send_from_directory, render_template
import os
import qrcode
from PIL import Image
import io
import base64

app = Flask(__name__)
UPLOAD_FOLDER = 'static/uploads/'
QR_FOLDER = 'static/qr-codes/'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['QR_FOLDER'] = QR_FOLDER

# Ensure the upload and qr-codes directories exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(QR_FOLDER, exist_ok=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate-qr', methods=['POST'])
def generate_qr():
    url = request.form['url']
    format = request.form['format']
    logo = request.files['logo']

    logo_path = os.path.join(app.config['UPLOAD_FOLDER'], logo.filename)
    logo.save(logo_path)

    # Create QR code
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill='black', back_color='white').convert('RGB')

    # Add logo to QR code
    logo_img = Image.open(logo_path)
    logo_img = logo_img.resize((50, 50))
    pos = ((img.size[0] - logo_img.size[0]) // 2, (img.size[1] - logo_img.size[1]) // 2)
    img.paste(logo_img, pos, logo_img)

    # Save the QR code to the specified format
    filename = f'qr_code.{format}'
    file_path = os.path.join(app.config['QR_FOLDER'], filename)
    if format == 'png':
        img.save(file_path)
    elif format == 'svg':
        img.save(file_path, format='SVG')
    elif format == 'pdf':
        img.save(file_path, format='PDF')

    # Create preview URL
    buffered = io.BytesIO()
    img.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode()
    preview_url = f"data:image/png;base64,{img_str}"

    # Clean up uploaded logo
    os.remove(logo_path)

    return jsonify({
        'previewUrl': preview_url,
        'downloadUrl': f'/static/qr-codes/{filename}',
        'filename': filename,
        'format': format
    })

if __name__ == '__main__':
    app.run(debug=True)
