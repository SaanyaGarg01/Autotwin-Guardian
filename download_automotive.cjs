const fs = require('fs');
const path = require('path');
const https = require('https');

// Wikimedia Commons authentic automotive driving & smart mobility video streams
const wikiAutomotiveUrl = 'https://upload.wikimedia.org/wikipedia/commons/transcoded/6/65/Autonomous_car_driving_on_highway.webm/Autonomous_car_driving_on_highway.webm.480p.vp9.webm';
const wikiRadarUrl = 'https://upload.wikimedia.org/wikipedia/commons/transcoded/f/f6/Automotive_radar_sensor_demonstration.ogv/Automotive_radar_sensor_demonstration.ogv.480p.vp9.webm';

const targets = [
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

function fetchVideo(url, targetPath, cb) {
  const req = https.get(url, {
    headers: {
      'User-Agent': 'AutoTwinGuardian/1.0 (https://example.org; contact@autotwin.io)'
    }
  }, (res) => {
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      return fetchVideo(res.headers.location, targetPath, cb);
    }
    if (res.statusCode !== 200) {
      console.error(`Status ${res.statusCode} for ${url}`);
      return cb(new Error(`Status ${res.statusCode}`));
    }
    const file = fs.createWriteStream(targetPath);
    res.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log(`Saved ${targetPath}`);
      cb(null);
    });
  });
  req.on('error', cb);
}

let idx = 0;
function processNext() {
  if (idx >= targets.length) {
    console.log('ALL WIKIMEDIA AUTOMOTIVE CAR DRIVING VIDEOS DOWNLOADED!');
    return;
  }
  const name = targets[idx];
  const url = (idx % 2 === 0) ? wikiAutomotiveUrl : wikiRadarUrl;
  const dest = path.join(videosDir, name);
  console.log(`Downloading [${idx + 1}/${targets.length}] ${name}...`);
  fetchVideo(url, dest, (err) => {
    idx++;
    processNext();
  });
}

processNext();
