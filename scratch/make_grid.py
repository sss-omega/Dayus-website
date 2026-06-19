import os
from PIL import Image, ImageDraw, ImageFont

def make_grid():
    img_dir = "/home/ali/Documents/Almerek/dauys_original/public/microphones"
    output_path = "/home/ali/Documents/Almerek/dauys_original/public/grid_gallery.jpg"
    
    files = sorted([f for f in os.listdir(img_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png'))])
    print(f"Found {len(files)} files.")
    
    # Grid dimensions
    cols = 6
    rows = (len(files) + cols - 1) // cols
    thumb_width = 250
    thumb_height = 200
    label_height = 30
    
    grid_width = cols * thumb_width
    grid_height = rows * (thumb_height + label_height)
    
    grid_img = Image.new('RGB', (grid_width, grid_height), (30, 30, 30))
    draw = ImageDraw.Draw(grid_img)
    
    # Use default font
    try:
        font = ImageFont.load_default()
    except:
        font = None

    for i, filename in enumerate(files):
        c = i % cols
        r = i // cols
        
        x = c * thumb_width
        y = r * (thumb_height + label_height)
        
        filepath = os.path.join(img_dir, filename)
        try:
            with Image.open(filepath) as img:
                # Create thumbnail
                img.thumbnail((thumb_width, thumb_height))
                # Paste centered inside the thumb cell
                offset_x = (thumb_width - img.width) // 2
                offset_y = (thumb_height - img.height) // 2
                grid_img.paste(img, (x + offset_x, y + offset_y))
        except Exception as e:
            print(f"Error loading {filename}: {e}")
            
        # Draw label
        label = filename
        draw.text((x + 10, y + thumb_height + 5), label, fill=(255, 255, 255), font=font)
        draw.rectangle([x, y, x + thumb_width, y + thumb_height + label_height], outline=(100, 100, 100))
        
    grid_img.save(output_path, 'JPEG', quality=85)
    print(f"Grid gallery saved to {output_path}")

if __name__ == "__main__":
    make_grid()
