const fs = require('fs');
const path = require('path');
const https = require('https');

// API key from gallery.js
const apiKey = "AIzaSyAaK_K5ZedO5Gez6qd45s--Djk8XyqeBBw";
// Folder ID from gallery.js
const folderId = "1BHeR3ZdgC78LlmGCWX-VjlHYXkfbC0YVWngzeaQ5S5GXXUo5jMQicIOlS9hlYOyo0p4p2cXT";
// Sheet ID from gallery.js
const sheetId = "1zAAbzVA5-qK7UevrBGPiIJ0uHYu9wcegUK0pTES0JSw";

// Create textures directory if it doesn't exist
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
        // Fetch files from Google Drive
        console.log("Fetching files from Google Drive...");
        const filesResponse = await fetchFromGoogle(
            `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${apiKey}`
        );
        
        // Fetch sheet data
        console.log("Fetching sheet data...");
        const sheetResponse = await fetchFromGoogle(
            `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1?key=${apiKey}`
        );
        
        // Process data similar to gallery.js
        const sheetValues = sheetResponse.values.reverse();
        const filesResponseBounded = [];
        const sheetResponseBounded = [];
        
        for (let [i, elem] of sheetValues.entries()) {
            if (elem.length == 3 && elem[0] != "For which model is this texture for?") {
                sheetResponseBounded.push(sheetValues[i]);
                filesResponseBounded.push(filesResponse.files[i]);
            }
        }
        
        // Download each file
        console.log(`Found ${filesResponseBounded.length} texture files to download.`);
        
        const fileMapping = {};
        
        for (let [i, file] of filesResponseBounded.entries()) {
            const modelType = sheetResponseBounded[i][0]; // T-Shirt, Cap, Pants, or Hoodie
            const fileId = file.id;
            const fileName = `${modelType}_${fileId}.png`;
            const filePath = path.join(texturesDir, fileName);
            
            console.log(`Downloading ${fileName}...`);
            
            // Download file
            const fileUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?key=${apiKey}&alt=media`;
            await downloadFile(fileUrl, filePath);
            
            // Store mapping for later use
            fileMapping[fileId] = {
                path: `/textures/${fileName}`,
                modelType: modelType
            };
            
            console.log(`Downloaded ${fileName}`);
        }
        
        // Save file mapping for reference
        fs.writeFileSync(
            path.join(__dirname, 'texture_mapping.json'), 
            JSON.stringify(fileMapping, null, 2)
        );
        
        console.log("All textures downloaded successfully!");
        console.log("Texture mapping saved to texture_mapping.json");
        
    } catch (error) {
        console.error("Error:", error);
    }
}

main();
