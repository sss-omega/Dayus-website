from PIL import Image, ImageFilter

# Open cropped logo
img = Image.open('public/dauys_logo_transparent_cropped.png').convert("RGBA")

# Create a larger app/icon.png for high-res displays
img_large = img.resize((192, 192), Image.Resampling.LANCZOS)
img_large.save('src/app/icon.png', 'PNG')
img_apple = img.resize((180, 180), Image.Resampling.LANCZOS)
img_apple.save('src/app/apple-icon.png', 'PNG')

# Create a slightly bolded version for the 32x32 favicon
# We can just extract alpha, dilate it, and paste it back
r, g, b, a = img.split()
# Not doing complex dilation, just resize
img_small = img.resize((32, 32), Image.Resampling.LANCZOS)
img_small.save('public/favicon.ico', format='ICO', sizes=[(32,32)])
img_small.save('src/app/favicon.ico', format='ICO', sizes=[(32,32)])

print("Icons generated")
