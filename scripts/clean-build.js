import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const buildDir = path.join(rootDir, 'build', '2026', 'assets');

// Remove unused build artifacts
if (fs.existsSync(buildDir)) {
  const files = fs.readdirSync(buildDir);
  files.forEach(file => {
    // Remove index.js and index.css (from main.tsx build)
    if (file.startsWith('index-') && (file.endsWith('.js') || file.endsWith('.css'))) {
      const filePath = path.join(buildDir, file);
      fs.unlinkSync(filePath);
      console.log(`🗑️  Removed unused: ${file}`);
    }
    // Remove duplicate CSS files (keep only the latest)
    if (file.startsWith('enhance-') && file.endsWith('.css')) {
      // Keep only one enhance CSS file (the latest one)
      const files = fs.readdirSync(buildDir).filter(f => f.startsWith('enhance-') && f.endsWith('.css'));
      if (files.length > 1) {
        // Sort by modification time, keep the newest
        const sorted = files.map(f => ({
          name: f,
          time: fs.statSync(path.join(buildDir, f)).mtime
        })).sort((a, b) => b.time - a.time);
        // Remove all except the newest
        sorted.slice(1).forEach(f => {
          const filePath = path.join(buildDir, f.name);
          fs.unlinkSync(filePath);
          console.log(`🗑️  Removed duplicate: ${f.name}`);
        });
      }
    }
  });
}

console.log('✅ Build cleaned');


