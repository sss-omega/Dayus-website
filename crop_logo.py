from PIL import Image

def crop_transparent_edges(input_path, output_path_png, output_path_icon):
    img = Image.open(input_path).convert("RGBA")
    
    # Get bounding box
    bbox = img.getbbox()
    if bbox:
        img_cropped = img.crop(bbox)
        # Add a tiny bit of padding
        padding = 10
        width, height = img_cropped.size
        new_size = (width + padding*2, height + padding*2)
        padded_img = Image.new("RGBA", new_size, (255, 255, 255, 0))
        padded_img.paste(img_cropped, (padding, padding))
        
        padded_img.save(output_path_png, "PNG")
        
        # Save icon
        icon_size = (64, 64)
        img_icon = padded_img.resize(icon_size, Image.Resampling.LANCZOS)
        img_icon.save(output_path_icon, "PNG")
    else:
        print("Empty image")

crop_transparent_edges('public/dauys_logo_transparent.png', 'public/dauys_logo_transparent_cropped.png', 'src/app/icon.png')
print("Cropped")
