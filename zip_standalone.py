import os
import zipfile

def zipdir(path, ziph):
    for root, dirs, files in os.walk(path):
        for file in files:
            file_path = os.path.join(root, file)
            # Сохраняем структуру папок относительно корня standalone
            arcname = os.path.relpath(file_path, path)
            ziph.write(file_path, arcname)

print("👉 Zipping .next/standalone directory...")
zipf = zipfile.ZipFile('standalone.zip', 'w', zipfile.ZIP_DEFLATED)
zipdir('.next/standalone', zipf)
zipf.close()
print("✅ Successfully created standalone.zip!")
