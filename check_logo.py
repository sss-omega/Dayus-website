from PIL import Image

img = Image.open('public/dauys_logo_transparent_cropped.png').convert("RGBA")
datas = img.getdata()

min_x, min_y, max_x, max_y = 9999, 9999, 0, 0
width, height = img.size

for y in range(height):
    for x in range(width):
        r, g, b, a = img.getpixel((x, y))
        if a > 0:
            if r > 100 or g > 100 or b > 100:
                if x < min_x: min_x = x
                if x > max_x: max_x = x
                if y < min_y: min_y = y
                if y > max_y: max_y = y

print(f"Actual content bbox: {min_x}, {min_y}, {max_x}, {max_y}")
print(f"Content width: {max_x - min_x}, height: {max_y - min_y}")
