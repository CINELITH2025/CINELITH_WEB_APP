import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.join(__dirname, '../../frontend/public/images');

const imagesToDownload = {
  // Cinematic representation of Parasite's house architecture
  'parasite.jpg': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&auto=format&fit=crop',
  // Premium cinematic headshot portrait for the actor profile
  'chalamet.jpg': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop'
};

async function download(filename, url) {
  const filePath = path.join(imagesDir, filename);
  
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  const writer = fs.createWriteStream(filePath);
  console.log(`Downloading ${filename} from ${url}...`);

  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
      }
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        console.log(`Successfully saved ${filename}`);
        resolve();
      });
      writer.on('error', (err) => {
        console.error(`Error saving ${filename}:`, err);
        reject(err);
      });
    });
  } catch (error) {
    console.error(`Failed to download ${filename}:`, error.message);
  }
}

async function run() {
  for (const [filename, url] of Object.entries(imagesToDownload)) {
    await download(filename, url);
  }
  console.log("All image downloads completed!");
}

run();
