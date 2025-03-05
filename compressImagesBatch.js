const fs = require('fs');
const path = require('path');
const os = require('os');
const { Worker } = require('worker_threads');

// Get input folder from command-line arguments
const inputFolder = process.argv[2];

if (!inputFolder) {
  console.error("Usage: node compressImagesParallel.js <folder>");
  process.exit(1);
}

// Verify input folder exists
if (!fs.existsSync(inputFolder)) {
  console.error("Folder does not exist.");
  process.exit(1);
}

// Create output folder (e.g., originalFolder_compressed)
const outputFolder = `${inputFolder}_compressed`;
if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder);
}

// Supported image extensions
const imageExtensions = ['.jpg', '.jpeg', '.png'];
// Get list of image files
const files = fs.readdirSync(inputFolder).filter(file =>
  imageExtensions.includes(path.extname(file).toLowerCase())
);

console.log(`Found ${files.length} images. Processing with parallel workers...`);

// Set up worker pool (using one worker per CPU core)
const numWorkers = os.cpus().length;
let fileQueue = [...files]; // jobs queue
let completed = 0;

function createWorker() {
  const worker = new Worker('./compressWorker.js');
  worker.on('message', (msg) => {
    if (msg.status === 'done') {
      console.log(`Compressed: ${msg.file}`);
    } else if (msg.status === 'error') {
      console.error(`Error processing ${msg.file}: ${msg.error}`);
    }
    completed++;
    // If there are still jobs left, send the next job to this worker
    if (fileQueue.length > 0) {
      const nextFile = fileQueue.shift();
      worker.postMessage({
        file: nextFile,
        inputFolder,
        outputFolder
      });
    } else {
      // No more files; signal the worker to exit
      worker.postMessage({ action: 'exit' });
      // If all jobs are done, log completion
      if (completed === files.length) {
        console.log('All images processed.');
      }
    }
  });

  worker.on('error', (err) => {
    console.error('Worker encountered an error:', err);
  });

  worker.on('exit', (code) => {
    if (code !== 0) {
      console.error(`Worker stopped with exit code ${code}`);
    }
  });
  return worker;
}

// Create workers and assign initial jobs
for (let i = 0; i < numWorkers; i++) {
  const worker = createWorker();
  if (fileQueue.length > 0) {
    const nextFile = fileQueue.shift();
    worker.postMessage({
      file: nextFile,
      inputFolder,
      outputFolder
    });
  } else {
    worker.postMessage({ action: 'exit' });
  }
}