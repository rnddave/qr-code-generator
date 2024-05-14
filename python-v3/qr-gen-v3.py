import qrcode
from PIL import Image

def generate_qr_with_logo(url, logo_path, output_path):
    # Create a basic QR code
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(url)
    qr.make(fit=True)

    # Generate the QR code image
    qr_img = qr.make_image(fill_color="black", back_color="white").convert('RGB')

    # Open the logo image
    logo = Image.open(logo_path)

    # Calculate the size of the logo
    qr_width, qr_height = qr_img.size
    logo_size = qr_width // 5
    logo = logo.resize((logo_size, logo_size), Image.ANTIALIAS)

    # Calculate the position to paste the logo
    logo_pos = ((qr_width - logo_size) // 2, (qr_height - logo_size) // 2)

    # Paste the logo onto the QR code
    qr_img.paste(logo, logo_pos, mask=logo)

    # Save the resulting QR code with the logo
    qr_img.save(output_path)

# Example usage
generate_qr_with_logo(
    url='https://www.example.com',
    logo_path='logo.png',
    output_path='qrcode_with_logo.png'
)
