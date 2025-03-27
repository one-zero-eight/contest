const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// List of large images to resize
const largeImages = [
  'T-Shirt_1EktKoGbKMNJOKGlpHwwcfPGHaqDgT_Lq.png',
  'T-Shirt_1ZJ0-4VfZ27-YzckT5eoYE5tQ_nEYsjn6.png',
  'T-Shirt_1-pgetUn63L_v4i3c-HSIeuut7SUrdTe8.png',
  'T-Shirt_1EYegDwbPcHq_L5Tlv5LTqgreaHPSWlb_.png',
  'Hoodie_1PXqXexCtjYiQj8PrQoRPgFrY7ztW-vBl.png',
  'Hoodie_1c5Fgj6rb6MQESFICOQkSLwaA7pzwyOdu.png',
  'T-Shirt_1a1yhdeW2IB5fzmHHm2-xkYwriOSG9OES.png'
];

// Target size for resizing
const targetSize = 4096;

// Directory containing the textures
const texturesDir = path.join(__dirname, 'public', 'textures');

// Create backup directory
const backupDir = path.join(__dirname, 'public', 'textures_backup');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

// Function to resize an image using ImageMagick
function resizeImage(imagePath, outputPath) {
  return new Promise((resolve, reject) => {
    const command = `convert "${imagePath}" -resize ${targetSize}x${targetSize} "${outputPath}"`;
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error resizing ${path.basename(imagePath)}: ${error.message}`);
        reject(error);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }
      resolve();
    });
  });
}

async function main() {
  console.log('Starting image resize process...');
  
  for (const imageName of largeImages) {
    const imagePath = path.join(texturesDir, imageName);
    const backupPath = path.join(backupDir, imageName);
    
    // Check if the image exists
    if (!fs.existsSync(imagePath)) {
      console.log(`Image ${imageName} not found, skipping...`);
      continue;
    }
    
    // Backup the original image
    console.log(`Backing up ${imageName}...`);
    fs.copyFileSync(imagePath, backupPath);
    
    // Resize the image
    console.log(`Resizing ${imageName} to ${targetSize}x${targetSize}...`);
    try {
      await resizeImage(imagePath, imagePath);
      
      // Get file sizes for comparison
      const originalSize = fs.statSync(backupPath).size;
      const newSize = fs.statSync(imagePath).size;
      const reduction = ((originalSize - newSize) / originalSize * 100).toFixed(2);
      
      console.log(`Resized ${imageName}: ${(originalSize / 1024 / 1024).toFixed(2)}MB -> ${(newSize / 1024 / 1024).toFixed(2)}MB (${reduction}% reduction)`);
    } catch (error) {
      console.error(`Failed to resize ${imageName}: ${error.message}`);
    }
  }
  
  console.log('Image resize process completed!');
}

main().catch(console.error);
