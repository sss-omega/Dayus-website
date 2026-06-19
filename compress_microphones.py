import os
import sys
from PIL import Image

def compress_images(directory):
    if not os.path.exists(directory):
        print(f"❌ Directory {directory} does not exist.")
        return

    print("==================================================")
    print(f"📸 Starting image compression in: {directory}")
    print("==================================================")

    total_old_size = 0
    total_new_size = 0
    compressed_count = 0

    valid_extensions = ('.jpg', '.jpeg', '.png')
    files = [f for f in os.listdir(directory) if f.lower().endswith(valid_extensions)]

    for filename in files:
        filepath = os.path.join(directory, filename)
        old_size = os.path.getsize(filepath)
        total_old_size += old_size

        try:
            with Image.open(filepath) as img:
                # Get current dimensions
                width, height = img.size
                
                # Check if resize is needed (maximum 800px width/height)
                max_size = 800
                if width > max_size or height > max_size:
                    if width > height:
                        new_width = max_size
                        new_height = int(height * (max_size / width))
                    else:
                        new_height = max_size
                        new_width = int(width * (max_size / height))
                    
                    # Resize image using LANCZOS filter for high quality
                    img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
                
                # Convert to RGB if it was RGBA (JPEG doesn't support transparency)
                if img.mode in ('RGBA', 'LA'):
                    background = Image.new('RGB', img.size, (255, 255, 255))
                    background.paste(img, mask=img.split()[3] if img.mode == 'RGBA' else img.split()[1])
                    img = background
                elif img.mode != 'RGB':
                    img = img.convert('RGB')

                # Save back overwriting original file with high compression
                img.save(filepath, 'JPEG', quality=75, optimize=True, progressive=True)

            new_size = os.path.getsize(filepath)
            total_new_size += new_size
            compressed_count += 1
            
            savings_pct = (1 - (new_size / old_size)) * 100
            print(f"✅ {filename}: {old_size/1024/1024:.2f}MB ➔ {new_size/1024:.1f}KB (Сжато на {savings_pct:.1f}%)")

        except Exception as e:
            print(f"❌ Error compressing {filename}: {str(e)}")

    saved_mb = (total_old_size - total_new_size) / 1024 / 1024
    print("==================================================")
    print("🎉 Сжатие завершено!")
    print(f"📦 Обработано файлов: {compressed_count}")
    print(f"📉 Исходный размер: {total_old_size / 1024 / 1024:.2f} MB")
    print(f"📈 Новый размер: {total_new_size / 1024 / 1024:.2f} MB")
    print(f"💎 Сэкономлено на диске и трафике: {saved_mb:.2f} MB")
    print("==================================================")

if __name__ == "__main__":
    target_dir = os.path.abspath("./public/microphones")
    compress_images(target_dir)
