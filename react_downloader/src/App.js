import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [url, setUrl] = useState('');
  const [batchUrls, setBatchUrls] = useState('');
  const [customFilename, setCustomFilename] = useState('');
  const [isAudioOnly, setIsAudioOnly] = useState(false);
  const [status, setStatus] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [quality, setQuality] = useState('360');
  const [videoFormat, setVideoFormat] = useState('mp4');
  const [history, setHistory] = useState([]);
  const [availableFormats, setAvailableFormats] = useState([]);
  const [downloadLink, setDownloadLink] = useState('');

  const notifySuccess = (msg) => toast.success(msg);
  const notifyError = (msg) => toast.error(msg);

  useEffect(() => {
    if (!url) return;

    // Fetch thumbnail
    axios
      .post('http://localhost:5000/thumbnail', { url })
      .then((res) => setThumbnailUrl(res.data.thumbnail))
      .catch(() => console.error('Failed to get thumbnail'));

    // Fetch formats
    axios
      .post('http://localhost:5000/getFormats', { url })
      .then((res) => setAvailableFormats(res.data.formats))
      .catch(() => console.error('Failed to get formats'));
  }, [url]);

  const updateHistory = (url, status) => {
    setHistory((prev) => [
      ...prev,
      { url, status, timestamp: new Date().toLocaleString() },
    ]);
  };

  const handleSingleDownload = async () => {
    if (!url) return alert('Please enter a URL');

    setIsDownloading(true);
    setStatus('Starting download...');
    setDownloadLink('');

    try {
      const response = await axios.post('http://localhost:5000/download', {
        url,
        customFilename,
        isAudioOnly,
        quality,
        videoFormat,
      });

      if (response.data.status === 'Download completed') {
        const filename = customFilename
          ? `${customFilename}-${Date.now()}`
          : '%(title)s';
        setDownloadLink(`http://localhost:5000/downloads/${filename}.${videoFormat}`);
        notifySuccess('Download completed');
        updateHistory(url, 'Downloaded');
      }
    } catch (err) {
      notifyError('Download failed');
      setStatus('Download error');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleBatchDownload = async () => {
    if (!batchUrls) return alert('Please enter batch URLs');

    setIsDownloading(true);
    setStatus('Starting batch download...');
    const urls = batchUrls.split('\n').map((u) => u.trim()).filter((u) => u);

    try {
      const response = await axios.post('http://localhost:5000/batchDownload', {
        urls,
        customFilename,
        isAudioOnly,
        quality,
        videoFormat,
      });

      if (response.data.status) {
        notifySuccess(response.data.status);
        urls.forEach((u) => updateHistory(u, 'Batch downloaded'));
      }
    } catch (err) {
      notifyError('Batch download failed');
      setStatus('Batch download error');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center text-blue-500 mb-6">
          Video Downloader
        </h1>

        <input
          type="text"
          placeholder="Enter video URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-md"
        />

        {thumbnailUrl && (
          <img src={thumbnailUrl} alt="Video Thumbnail" className="w-full mb-4" />
        )}

        <input
          type="text"
          placeholder="Custom filename (optional)"
          value={customFilename}
          onChange={(e) => setCustomFilename(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-md"
        />

        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={isAudioOnly}
            onChange={() => setIsAudioOnly(!isAudioOnly)}
            className="mr-2"
          />
          Download audio only
        </label>

        {availableFormats.length > 0 && (
          <select
            onChange={(e) => setQuality(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-md"
          >
            {availableFormats.map((fmt, idx) => (
              <option key={idx} value={fmt.resolution.replace('p', '')}>
                {fmt.resolution} - {fmt.ext} (id: {fmt.format_id})
              </option>
            ))}
          </select>
        )}

        <select
          value={videoFormat}
          onChange={(e) => setVideoFormat(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-md"
        >
          <option value="mp4">MP4</option>
          <option value="mp3">MP3 (Audio Only)</option>
        </select>

        <button
          onClick={handleSingleDownload}
          disabled={isDownloading}
          className="w-full p-3 bg-blue-500 text-white rounded-md disabled:bg-gray-400 mb-4"
        >
          {isDownloading ? 'Downloading...' : 'Download Video'}
        </button>

        <textarea
          placeholder="Batch URLs (one per line)"
          value={batchUrls}
          onChange={(e) => setBatchUrls(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-md"
        />

        <button
          onClick={handleBatchDownload}
          disabled={isDownloading}
          className="w-full p-3 bg-green-500 text-white rounded-md disabled:bg-gray-400"
        >
          {isDownloading ? 'Downloading...' : 'Download Batch'}
        </button>

        {downloadLink && (
          <div className="text-center mt-4">
            <a
              href={downloadLink}
              className="text-blue-600 underline"
              download
            >
              Click here to download file
            </a>
          </div>
        )}

        <div className="mt-6">
          <h2 className="text-xl font-semibold text-center mb-4">Download History</h2>
          <ul className="space-y-2">
            {history.map((entry, i) => (
              <li key={i} className="text-gray-600">
                <p>{entry.url}</p>
                <p className="text-sm text-gray-400">{entry.timestamp}</p>
                <p className="text-sm">{entry.status}</p>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-4 text-center text-gray-600">{status}</p>
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
