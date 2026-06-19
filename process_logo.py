from PIL import Image

def remove_black_background(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()
    
    newData = []
    for item in datas:
        # If pixel is dark (r,g,b all < 50), make it transparent
        if item[0] < 50 and item[1] < 50 and item[2] < 50:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)
            
    img.putdata(newData)
    img.save(output_path, "PNG")

    # Save as ICO
    icon_size = (32, 32)
    img_ico = img.resize(icon_size)
    img_ico.save('public/favicon.ico', format='ICO', sizes=[(32,32)])
    
remove_black_background('public/photo_2026-06-17_14-39-29.jpg', 'public/dauys_logo_transparent.png')
print("Done")
