const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const videoSources = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-car-driving-on-a-highway-at-night-41553-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-dashboard-of-a-car-driving-at-night-41554-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-hud-display-interface-animation-43229-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-robotic-arm-working-in-a-factory-43187-large.mp4'
];

const targetFiles = [
  'dashboard1.mp4', 'dashboard2.mp4', 'dashboard3.mp4',
  'twin1.mp4', 'twin2.mp4', 'twin3.mp4',
  'journey1.mp4', 'journey2.mp4', 'journey3.mp4',
  'diagnostics1.mp4', 'diagnostics2.mp4',
  'maintenance1.mp4', 'maintenance2.mp4'
];

const videosDir = path.join(__dirname, 'public', 'videos');
if (!fs.existsSync(videosDir)) {
  fs.mkdirSync(videosDir, { recursive: true });
}

function downloadFile(url, destPath, callback) {
  const client = url.startsWith('https') ? https : http;
  const req = client.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': '*/*'
    }
  }, (res) => {
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      console.log(`Following redirect from ${url} to ${res.headers.location}`);
      return downloadFile(res.headers.location, destPath, callback);
    }
    if (res.statusCode !== 200) {
      console.error(`Failed to download ${url}: status ${res.statusCode}`);
      return callback(new Error(`Status ${res.statusCode}`));
    }

    const fileStream = fs.createWriteStream(destPath);
    res.pipe(fileStream);
    fileStream.on('finish', () => {
      fileStream.close();
      console.log(`Successfully saved ${destPath}`);
      callback(null);
    });
  });

  req.on('error', (err) => {
    console.error(`Error downloading ${url}:`, err.message);
    callback(err);
  });
}

// Download Subaru Automotive EV/Car Driving MP4 for all targets
const mainAutomotiveUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4';

console.log('Starting direct automotive video downloads...');
let completed = 0;
targetFiles.forEach((filename) => {
  const destPath = path.join(videosDir, filename);
  downloadFile(mainAutomotiveUrl, destPath, (err) => {
    completed++;
    if (completed === targetFiles.length) {
      console.log('ALL AUTOMOTIVE VIDEOS DOWNLOADED SUCCESSFULLY!');
    }
  });
});
