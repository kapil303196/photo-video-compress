const { parentPort } = require('worker_threads');
const path = require('path');
const sharp = require('sharp');

parentPort.on('message', async (msg) => {
  if (msg.action === 'exit') {
    process.exit(0);
  } else if (msg.file) {
    const { file, inputFolder, outputFolder } = msg;
    const inputPath = path.join(inputFolder, file);
    const outputPath = path.join(outputFolder, file);
    try {
      const ext = path.extname(file).toLowerCase();
      if (ext === '.jpg' || ext === '.jpeg') {
        // Compress JPEG images (adjust quality as needed)
        await sharp(inputPath)
          .jpeg({ quality: 80, mozjpeg: true })
          .toFile(outputPath);
      } else if (ext === '.png') {
        // Compress PNG images (adjust quality/compressionLevel as needed)
        await sharp(inputPath)
          .png({ quality: 80, compressionLevel: 9 })
          .toFile(outputPath);
      }
      parentPort.postMessage({ status: 'done', file });
    } catch (error) {
      parentPort.postMessage({ status: 'error', file, error: error.message });
    }
  }
});