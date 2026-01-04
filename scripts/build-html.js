import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const buildDir = path.join(rootDir, 'build');
const assetsDir = path.join(rootDir, 'build', '2026', 'assets');

// Ensure build directories exist
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Reuse the frontmatter parser logic
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { data: {}, content: content.trim() };
  }
  
  const yamlContent = match[1];
  const markdownContent = match[2];
  
  const data = {};
  const lines = yamlContent.split('\n');
  let currentKey = '';
  let currentArray = null;
  
  for (const line of lines) {
    if (!line.trim()) continue;
    
    const arrayItemMatch = line.match(/^\s+-\s+label:\s*"?([^"]*)"?$/);
    if (arrayItemMatch && currentArray) {
      currentArray.push({ label: arrayItemMatch[1], value: '' });
      continue;
    }
    
    const arrayValueMatch = line.match(/^\s+value:\s*"?([^"]*)"?$/);
    if (arrayValueMatch && currentArray && currentArray.length > 0) {
      currentArray[currentArray.length - 1].value = arrayValueMatch[1];
      continue;
    }
    
    const keyValueMatch = line.match(/^(\w+):\s*(.*)$/);
    if (keyValueMatch) {
      const [, key, value] = keyValueMatch;
      currentKey = key;
      
      if (!value.trim()) {
        currentArray = [];
        data[key] = currentArray;
      } else {
        currentArray = null;
        let parsedValue = value.trim().replace(/^["']|["']$/g, '');
        if (/^\d+$/.test(parsedValue)) {
          data[key] = parseInt(parsedValue, 10);
        } else {
          data[key] = parsedValue;
        }
      }
    }
  }
  
  return { data, content: markdownContent.trim() };
}

// Convert frontmatter object to HTML <dl>
function frontmatterToHTML(frontmatter) {
  const items = [];
  
  // Add top separator
  items.push('<div class="frontmatter-separator">---</div>');
  
  Object.entries(frontmatter).forEach(([key, value]) => {
    if (key === 'sidebar_meta' && Array.isArray(value)) {
      items.push(`<dt>${key}: </dt>`);
      const metaItems = value.map((item) => 
        `<dd><dl><dt>label: </dt><dd>${escapeHtml(item.label)}</dd><dt>value: </dt><dd>${escapeHtml(item.value)}</dd></dl></dd>`
      ).join('');
      items.push(metaItems);
    } else {
      // Put colon and space directly in dt text to avoid pseudo-element issues
      items.push(`<dt>${key}: </dt>`);
      items.push(`<dd>${escapeHtml(String(value))}</dd>`);
    }
  });
  
  // Add bottom separator
  items.push('<div class="frontmatter-separator">---</div>');
  
  return `<aside class="frontmatter"><dl>${items.join('')}</dl></aside>`;
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Configure marked for HTML output
marked.setOptions({
  breaks: false,
  gfm: true,
});

// Fix image paths in HTML
function fixImagePaths(html) {
  // Fix images in public folder
  html = html.replace(/src="([^"]*\.(jpg|jpeg|png|gif|svg|webp))"/gi, (match, src) => {
    // Skip external URLs
    if (src.startsWith('http')) {
      return match;
    }
    // /content/images/filename → /2026/images/filename
    if (src.startsWith('/content/images/')) {
      const filename = src.split('/').pop();
      return `src="/2026/images/${filename}"`;
    }
    // ms-25.jpg, favicon go to root
    if (src.startsWith('ms-') || src.includes('favicon')) {
      return `src="/${src}"`;
    }
    // placeholder.svg goes to /2026/
    if (src.includes('placeholder')) {
      return `src="/2026/${src}"`;
    }
    // Default: assume it's in public, go to /2026/
    return `src="/2026/${src}"`;
  });
  
  return html;
}

// Read all markdown files
const sectionsDir = path.join(rootDir, 'content', 'sections');
const files = fs.readdirSync(sectionsDir)
  .filter(file => file.endsWith('.md'))
  .sort();

const sections = files.map(file => {
  const filePath = path.join(sectionsDir, file);
  const rawContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = parseFrontmatter(rawContent);
  const slug = file.replace('.md', '');
  
  return {
    slug,
    frontmatter: data,
    content,
    rawMarkdown: rawContent,
  };
}).sort((a, b) => (a.frontmatter.order || 0) - (b.frontmatter.order || 0));

// Generate HTML sections
const sectionsHTML = sections.map(section => {
  const frontmatterHTML = frontmatterToHTML(section.frontmatter);
  const contentHTML = marked.parse(section.content);
  const fixedContentHTML = fixImagePaths(contentHTML);
  
  return `
  <section data-slug="${section.slug}" id="${section.slug}">
    ${frontmatterHTML}
    <div class="markdown">
      ${fixedContentHTML}
    </div>
  </section>`;
}).join('\n');

// Read the base HTML template
const templatePath = path.join(rootDir, 'index.html');
const baseTemplate = fs.readFileSync(templatePath, 'utf-8');

// Extract the head section (before body)
const headMatch = baseTemplate.match(/<head>[\s\S]*?<\/head>/);
const head = headMatch ? headMatch[0] : '';

// Generate static HTML with correct base path
const staticHTML = `<!doctype html>
<html lang="de">
${head}
  <body>
    <main class="markdown-mode">
      ${sectionsHTML}
    </main>
    <script type="module" src="/2026/assets/enhance.js"></script>
  </body>
</html>`;

// Find the actual enhance.js and enhance.css files (with hash)
let enhanceScriptPath = '/2026/assets/enhance.js';
let enhanceCssPath = null;

if (fs.existsSync(assetsDir)) {
  const assets = fs.readdirSync(assetsDir);
  
  // Find enhance.js (prefer exact match, fallback to any enhance*.js)
  const enhanceFile = assets.find(f => f === 'enhance.js') || 
                      assets.find(f => f.startsWith('enhance') && f.endsWith('.js'));
  if (enhanceFile) {
    enhanceScriptPath = `/2026/assets/${enhanceFile}`;
    console.log(`📜 Found enhance script: ${enhanceFile}`);
  } else {
    console.warn('⚠️  No enhance.js found in assets directory');
  }
  
  // Find enhance.css (must have hash)
  const enhanceCssFile = assets.find(f => f.startsWith('enhance-') && f.endsWith('.css'));
  if (enhanceCssFile) {
    enhanceCssPath = `/2026/assets/${enhanceCssFile}`;
    console.log(`🎨 Found enhance CSS: ${enhanceCssFile}`);
  } else {
    console.warn('⚠️  No enhance CSS found in assets directory');
  }
} else {
  console.warn(`⚠️  Assets directory not found: ${assetsDir}`);
}

// Add CSS link to head if found
let headWithCss = head;
if (enhanceCssPath) {
  // Insert CSS link before closing </head>
  headWithCss = head.replace('</head>', `  <link rel="stylesheet" href="${enhanceCssPath}">\n  </head>`);
}

// Generate static HTML with CSS in head
const staticHTMLWithCss = `<!doctype html>
<html lang="de">
${headWithCss}
  <body>
    <main class="markdown-mode">
      ${sectionsHTML}
    </main>
    <script type="module" src="${enhanceScriptPath}"></script>
  </body>
</html>`;

// Replace placeholder with actual path (if still needed)
const finalHTML = staticHTMLWithCss;

// Write the static HTML to build directory (root level)
const outputPath = path.join(buildDir, 'index.html');
fs.writeFileSync(outputPath, finalHTML, 'utf-8');

console.log(`✅ Generated static HTML with ${sections.length} sections`);
console.log(`📁 Output: ${outputPath}`);
