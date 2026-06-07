const fs = require('fs');
const path = require('path');

const srcDir = '/home/ali/Downloads/Telegram Desktop/Рекламные фото/2025.04.18 (Микрофоны)';
const destDir = path.join(__dirname, 'public', 'microphones');

try {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const files = fs.readdirSync(srcDir);
  console.log(`Found ${files.length} files in source directory.`);

  let count = 0;
  files.forEach(file => {
    const srcPath = path.join(srcDir, file);
    const destPath = path.join(destDir, file);

    // Only copy image files
    if (file.toLowerCase().endsWith('.jpg') || file.toLowerCase().endsWith('.jpeg') || file.toLowerCase().endsWith('.png')) {
      fs.copyFileSync(srcPath, destPath);
      count++;
    }
  });

  console.log(`Successfully copied ${count} image files.`);
} catch (err) {
  console.error('Error during copy operations:', err);
}
