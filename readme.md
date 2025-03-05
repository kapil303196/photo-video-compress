# Photo & Video Compression

A Node.js repository for compressing images and videos using worker threads.

## Prerequisites

- [Node.js](https://nodejs.org) must be installed on your system.
- Hardware : i7 8th gen, 16GB Ram
## Installation

1. **Download the ZIP:**
   - Visit [photo-video-compress](https://github.com/kapil303196/photo-video-compress)
   - Click **"Download ZIP"** and extract it.

2. **Open the Folder in Terminal:**
   - **Windows:** Open File Explorer, navigate to the folder, hold **Shift**, right-click, and choose **"Open PowerShell window here"**.
   - **macOS/Linux:** Open Terminal and run:
     ```bash
     cd /photo-video-compress
     ```

3. **Install Dependencies:**
   ```bash
   npm install
   ```
## Usage

1. **Image Compression:**
    ```bash
    node compressImagesBatch.js /path/to/your/image-folder
    ```

2.  **Video Compression:**
    ```bash
    node compressVideosParallel.js /path/to/your/video-folder
    ```