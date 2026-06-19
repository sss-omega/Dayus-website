const fs = require('fs');
const path = require('path');

function copyFolderSync(from, to) {
    if (!fs.existsSync(from)) return;
    fs.mkdirSync(to, { recursive: true });
    fs.readdirSync(from).forEach(element => {
        const fromPath = path.join(from, element);
        const toPath = path.join(to, element);
        if (fs.lstatSync(fromPath).isDirectory()) {
            copyFolderSync(fromPath, toPath);
        } else {
            fs.copyFileSync(fromPath, toPath);
        }
    });
}

// 1. Copy static files
console.log('👉 Copying .next/static to .next/standalone/.next/static...');
copyFolderSync(
    path.join(__dirname, '.next', 'static'),
    path.join(__dirname, '.next', 'standalone', '.next', 'static')
);

// 2. Copy public folder
console.log('👉 Copying public files to .next/standalone/public...');
const publicDest = path.join(__dirname, '.next', 'standalone', 'public');
fs.mkdirSync(publicDest, { recursive: true });

const publicSource = path.join(__dirname, 'public');
if (fs.existsSync(publicSource)) {
    fs.readdirSync(publicSource).forEach(file => {
        const srcPath = path.join(publicSource, file);
        const destPath = path.join(publicDest, file);
        if (fs.lstatSync(srcPath).isDirectory()) {
            copyFolderSync(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    });
}

// 3. Copy .env
console.log('👉 Copying .env to .next/standalone/.env...');
const envSource = path.join(__dirname, '.env');
const envDest = path.join(__dirname, '.next', 'standalone', '.env');
if (fs.existsSync(envSource)) {
    fs.copyFileSync(envSource, envDest);
}

// 4. Copy prisma folder
console.log('👉 Copying prisma folder to .next/standalone/prisma...');
copyFolderSync(
    path.join(__dirname, 'prisma'),
    path.join(__dirname, '.next', 'standalone', 'prisma')
);

console.log('✅ Standalone directory prepared successfully!');
