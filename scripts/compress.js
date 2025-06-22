// scripts/compress.js

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const DIST_DIR = path.join(__dirname, '..', 'dist');
const FILE_EXTENSIONS = ['.js', '.css', '.html', '.json', '.svg'];

async function compressFile(filePath) {
  try {
    const content = await readFile(filePath);
    
    // Gzip compression
    const gzipped = await promisify(zlib.gzip)(content, {
      level: 9 // Maximum compression
    });
    
    await writeFile(`${filePath}.gz`, gzipped);
    
    // Brotli compression (if available)
    if (zlib.brotliCompress) {
      const brotlied = await promisify(zlib.brotliCompress)(content, {
        params: {
          [zlib.constants.BROTLI_PARAM_QUALITY]: 11, // Maximum compression
        }
      });
      
      await writeFile(`${filePath}.br`, brotlied);
    }
    
    const originalSize = content.length;
    const gzipSize = gzipped.length;
    const compressionRatio = ((1 - gzipSize / originalSize) * 100).toFixed(2);
    
    console.log(`✅ ${path.basename(filePath)} - ${compressionRatio}% compressed`);
  } catch (error) {
    console.error(`❌ Error compressing ${filePath}:`, error.message);
  }
}

async function* getFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      yield* getFiles(fullPath);
    } else if (FILE_EXTENSIONS.some(ext => entry.name.endsWith(ext))) {
      yield fullPath;
    }
  }
}

async function compressAll() {
  console.log('🗜️  Starting compression...\n');
  
  if (!fs.existsSync(DIST_DIR)) {
    console.error('❌ Build directory not found. Run "npm run build" first.');
    process.exit(1);
  }
  
  let fileCount = 0;
  
  for await (const file of getFiles(DIST_DIR)) {
    await compressFile(file);
    fileCount++;
  }
  
  console.log(`\n✅ Compressed ${fileCount} files successfully!`);
}

// Run compression
compressAll().catch(console.error);