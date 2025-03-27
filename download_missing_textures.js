const fs = require('fs');
const path = require('path');
const https = require('https');

// API key from gallery.js
const apiKey = "AIzaSyAaK_K5ZedO5Gez6qd45s--Djk8XyqeBBw";

// Missing file IDs
const missingFileIds = [
  "1Q2OgA5BCMJIF1e07Sq2_7XXugLtLasnC",
  "1NTrEF-OoaDBIh4NzcP1ot_7Zj_omfF2U",
  "15rl-bv4L9xBTxqOWv8AyIUIHNDKgvkHg",
  "1LNPtnl6mpgX-NII3c-HtGiX6DZdmF1r9"
];

// Directory containing the textures
const texturesDir = path.join(__dirname, 'public', 'textures');
if (!fs.existsSync(texturesDir)) {
  fs.mkdirSync(texturesDir, { recursive: true });
}

// Function to fetch data from Google API
async function fetchFromGoogle(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', (e) => {
      reject(e);
    });
  });
}

// Function to download a file
function downloadFile(url, filePath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    https.get(url, (res) => {
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {});
      reject(err);
    });
  });
}

async function main() {
  try {
    console.log("Downloading missing texture files...");
    
    for (const fileId of missingFileIds) {
      // Get file metadata to determine the model type
      console.log(`Fetching metadata for file ${fileId}...`);
      const fileMetadata = await fetchFromGoogle(
        `https://www.googleapis.com/drive/v3/files/${fileId}?fields=name&key=${apiKey}`
      );
      
      // Determine model type based on file name (this is a guess, adjust as needed)
      let modelType = "T-Shirt"; // Default
      const fileName = fileMetadata.name || "";
      
      if (fileName.toLowerCase().includes("cap")) {
        modelType = "Cap";
      } else if (fileName.toLowerCase().includes("hoodie")) {
        modelType = "Hoodie";
      } else if (fileName.toLowerCase().includes("pants")) {
        modelType = "Pants";
      }
      
      // Create file name
      const outputFileName = `${modelType}_${fileId}.png`;
      const filePath = path.join(texturesDir, outputFileName);
      
      // Download file
      console.log(`Downloading ${outputFileName}...`);
      const fileUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?key=${apiKey}&alt=media`;
      await downloadFile(fileUrl, filePath);
      
      console.log(`Downloaded ${outputFileName}`);
    }
    
    console.log("All missing texture files downloaded successfully!");
    
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
