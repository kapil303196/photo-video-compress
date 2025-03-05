const { parentPort } = require('worker_threads');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');

// Set the ffmpeg path so that fluent-ffmpeg can use the bundled binary
ffmpeg.setFfmpegPath(ffmpegPath);

parentPort.on('message', async (msg) => {
  if (msg.action === 'exit') {
    process.exit(0);
  } else if (msg.file) {
    const { file, inputFolder, outputFolder } = msg;
    const inputPath = path.join(inputFolder, file);
    const outputPath = path.join(outputFolder, file);

    // Use ffmpeg to compress the video:
    // - Uses libx264 codec
    // - CRF 23: lower values improve quality but increase file size
    // - preset "fast": adjust for speed vs. compression ratio
    ffmpeg(inputPath)
      .outputOptions(['-vcodec libx264', '-crf 23', '-preset fast'])
      .on('end', () => {
        parentPort.postMessage({ status: 'done', file });
      })
      .on('error', (err) => {
        parentPort.postMessage({ status: 'error', file, error: err.message });
      })
      .save(outputPath);
  }
});