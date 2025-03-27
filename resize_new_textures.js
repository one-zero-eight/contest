const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Directory containing the textures
const texturesDir = path.join(__dirname, 'public', 'textures');
const texturesBackupDir = path.join(__dirname, 'public', 'textures_backup');

// Create backup directory if it doesn't exist
if (!fs.existsSync(texturesBackupDir)) {
  fs.mkdirSync(texturesBackupDir, { recursive: true });
}

// New texture files to resize
const newTextureFiles = [
  'T-Shirt_1Q2OgA5BCMJIF1e07Sq2_7XXugLtLasnC.png',
  'T-Shirt_1NTrEF-OoaDBIh4NzcP1ot_7Zj_omfF2U.png',
  'T-Shirt_15rl-bv4L9xBTxqOWv8AyIUIHNDKgvkHg.png',
  'T-Shirt_1LNPtnl6mpgX-NII3c-HtGiX6DZdmF1r9.png'
];

// Target size for resized images
const targetSize = 4096;

// Process each texture file
newTextureFiles.forEach(fileName => {
  const filePath = path.join(texturesDir, fileName);
  const backupPath = path.join(texturesBackupDir, fileName);
  
  if (fs.existsSync(filePath)) {
    // Get file size before resizing
    const fileSizeBefore = fs.statSync(filePath).size;
    
    // Get image dimensions
    const dimensions = execSync(`identify -format "%wx%h" "${filePath}"`).toString().trim();
    const [width, height] = dimensions.split('x').map(Number);
    
    console.log(`Processing ${fileName}: ${width}x${height}, ${(fileSizeBefore / (1024 * 1024)).toFixed(2)}MB`);
    
    // Backup original file
    fs.copyFileSync(filePath, backupPath);
    console.log(`Backed up to ${backupPath}`);
    
    // Resize the image if it's larger than the target size
    if (width > targetSize || height > targetSize) {
      console.log(`Resizing ${fileName} to ${targetSize}x${targetSize}...`);
      
      try {
        // Use ImageMagick to resize the image
        execSync(`convert "${filePath}" -resize ${targetSize}x${targetSize} "${filePath}"`);
        
        // Get file size after resizing
        const fileSizeAfter = fs.statSync(filePath).size;
        const reductionPercent = ((fileSizeBefore - fileSizeAfter) / fileSizeBefore * 100).toFixed(2);
        
        console.log(`Resized ${fileName}: ${(fileSizeAfter / (1024 * 1024)).toFixed(2)}MB (${reductionPercent}% reduction)`);
      } catch (error) {
        console.error(`Error resizing ${fileName}:`, error.message);
      }
    } else {
      console.log(`${fileName} is already smaller than ${targetSize}x${targetSize}, skipping.`);
    }
  } else {
    console.log(`File not found: ${filePath}`);
  }
});

console.log('Resizing complete!');
