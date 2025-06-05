const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// Ensure downloads directory exists
const downloadsDir = path.join(__dirname, 'downloads');
if (!fs.existsSync(downloadsDir)) fs.mkdirSync(downloadsDir);

// Serve downloaded files
app.use('/downloads', express.static(downloadsDir));

// URL validation
function isValidUrl(url) {
  const pattern = /^https?:\/\/.+/i;
  return pattern.test(url);
}

// Get video thumbnail
app.post('/thumbnail', (req, res) => {
  const { url } = req.body;
  if (!isValidUrl(url)) return res.status(400).send('Invalid URL');
  exec(`yt-dlp --get-thumbnail ${url}`, (err, stdout) => {
    if (err) return res.status(500).send('Thumbnail fetch failed');
    res.send({ thumbnail: stdout.trim() });
  });
});

// Get available formats
app.post('/getFormats', (req, res) => {
  const { url } = req.body;
  if (!isValidUrl(url)) return res.status(400).send('Invalid URL');

  exec(`yt-dlp -F ${url}`, (err, stdout) => {
    if (err) return res.status(500).send('Format fetch failed');
    const lines = stdout.split('\n').filter(line => line.match(/^\d+/));
    const formats = lines.map(line => {
      const parts = line.trim().split(/\s+/);
      return { format_id: parts[0], ext: parts[1], resolution: parts[2] };
    });
    res.send({ formats });
  });
});

// Download single video
app.post('/download', (req, res) => {
  const { url, customFilename, isAudioOnly, quality, videoFormat } = req.body;
  if (!isValidUrl(url)) return res.status(400).send('Invalid URL');

  const timestamp = Date.now();
  const baseFilename = customFilename ? `${customFilename}-${timestamp}` : '%(title)s';
  const format = isAudioOnly ? 'bestaudio' : `bestvideo[height<=${quality}]+bestaudio`;
  const audioArgs = videoFormat === 'mp3' ? '--extract-audio --audio-format mp3' : '';
  const output = `"${downloadsDir}/${baseFilename}.%(ext)s"`;

  const cmd = `yt-dlp -f "${format}" ${audioArgs} -o ${output} ${url}`;
  exec(cmd, (err, stdout, stderr) => {
    if (err) return res.status(500).send('Download failed');
    res.send({ status: 'Download completed', file: `${baseFilename}` });
  });
});

// Batch download route
app.post('/batchDownload', async (req, res) => {
  const { urls, customFilename, isAudioOnly, quality, videoFormat } = req.body;
  if (!urls || !Array.isArray(urls)) return res.status(400).send('No URLs provided');

  const downloadPromises = urls.map((url, index) => {
    const timestamp = Date.now();
    const baseFilename = customFilename
      ? `${customFilename}-${index}-${timestamp}`
      : '%(title)s';
    const format = isAudioOnly ? 'bestaudio' : `bestvideo[height<=${quality}]+bestaudio`;
    const audioArgs = videoFormat === 'mp3' ? '--extract-audio --audio-format mp3' : '';
    const output = `"${downloadsDir}/${baseFilename}.%(ext)s"`;
    const cmd = `yt-dlp -f "${format}" ${audioArgs} -o ${output} ${url}`;

    return new Promise((resolve, reject) => {
      exec(cmd, (err, stdout, stderr) => {
        if (err) return reject(stderr);
        resolve(`Downloaded ${url}`);
      });
    });
  });

  try {
    await Promise.all(downloadPromises);
    res.send({ status: 'Batch download completed' });
  } catch (error) {
    res.status(500).send('One or more downloads failed');
  }
});

// Start server
app.listen(5000, () => {
  console.log('Server running at http://localhost:5000');
});
