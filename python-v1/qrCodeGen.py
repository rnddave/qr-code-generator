import qrcode
from qrcode.image.styledpil import StyledPilImage
from qrcode.image.styles.moduledrawers import RoundedModuleDrawer
from qrcode.image.styles.colormasks import SolidFillColorMask
from PIL import Image

# Create a QR code instance
qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_L,
    box_size=10,
    border=4,
)

# Add the data to encode
qr.add_data('https://example.com')
qr.make(fit=True)

# Generate the QR code image
img = qr.make_image(fill_color="black", back_color="white")

# Open the logo image
logo = Image.open("logo.png")

# Calculate the size and position of the logo
logo_size = int(img.size[0] / 4)
logo_pos = ((img.size[0] - logo_size) // 2, (img.size[1] - logo_size) // 2)

# Create a styled QR code image
styled_img = StyledPilImage(img.size, back_color="white")

# Add the QR code to the styled image
styled_img.paste_image(
    img,
    RoundedModuleDrawer(2, 1, 0, 1, 2, "white", back_color="white"),
    SolidFillColorMask(back_color="white", front_color="black"),
)

# Resize and paste the logo
logo = logo.resize((logo_size, logo_size))
styled_img.paste(logo, logo_pos)

# Save the styled QR code image
styled_img.save("qr_code_with_logo.png")