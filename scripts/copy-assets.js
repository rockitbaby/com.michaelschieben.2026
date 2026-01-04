import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const buildDir = path.join(rootDir, 'build');
const build2026Dir = path.join(rootDir, 'build', '2026');

// Ensure directories exist
const imagesDir = path.join(build2026Dir, 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Copy all public assets to build root
const publicDir = path.join(rootDir, 'public');
if (fs.existsSync(publicDir)) {
  const publicFiles = fs.readdirSync(publicDir);
  publicFiles.forEach(file => {
    const src = path.join(publicDir, file);
    const dest = path.join(buildDir, file);
    if (fs.statSync(src).isFile()) {
      fs.copyFileSync(src, dest);
      console.log(`📋 Copied to build/: ${file}`);
    }
  });
}

// Copy content/images to build/2026/images
const contentImagesDir = path.join(rootDir, 'content', 'images');
if (fs.existsSync(contentImagesDir)) {
  const imageFiles = fs.readdirSync(contentImagesDir);
  imageFiles.forEach(file => {
    const src = path.join(contentImagesDir, file);
    const dest = path.join(imagesDir, file);
    if (fs.statSync(src).isFile()) {
      fs.copyFileSync(src, dest);
      console.log(`🖼️  Copied image: images/${file}`);
    }
  });
}

console.log('✅ Assets copied');
