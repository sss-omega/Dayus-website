const fs = require('fs');
const path = require('path');

const srcDir = '/home/ali/Downloads/Telegram Desktop/Рекламные фото/2025.04.18 (Микрофоны)';
const destDir = path.join(__dirname, '..', 'public', 'microphones');

try {
  console.log(`Checking source directory: ${srcDir}`);
  if (!fs.existsSync(srcDir)) {
    console.error(`ERROR: Source directory not found: ${srcDir}`);
    console.error("Please verify that the path to the microphone images is correct.");
    process.exit(1);
  }

  console.log(`Checking destination directory: ${destDir}`);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
    console.log("Created directory public/microphones");
  }

  const files = fs.readdirSync(srcDir);
  let count = 0;
  
  files.forEach(file => {
    const srcPath = path.join(srcDir, file);
    const destPath = path.join(destDir, file);
    const ext = path.extname(file).toLowerCase();
    
    if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
      fs.copyFileSync(srcPath, destPath);
      count++;
    }
  });

  console.log(`SUCCESS: Copied ${count} images to public/microphones/!`);
} catch (error) {
  console.error("Failed to copy files:", error);
  process.exit(1);
}
