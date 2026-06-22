const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const ffprobeInstaller = require('@ffprobe-installer/ffprobe');
const ffmpeg = require('fluent-ffmpeg');

// Set ffmpeg and ffprobe paths, mapping to app.asar.unpacked when packaged
let ffmpegPath = ffmpegInstaller.path;
let ffprobePath = ffprobeInstaller.path;

if (app.isPackaged) {
  ffmpegPath = ffmpegPath.replace('app.asar', 'app.asar.unpacked');
  ffprobePath = ffprobePath.replace('app.asar', 'app.asar.unpacked');
}

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

let mainWindow;
const settingsPath = path.join(app.getPath('userData'), 'watermark_settings.json');
let activeFfmpegCommand = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 700,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    title: "Bulk Video Watermarker",
    icon: path.join(__dirname, 'src', 'assets', 'icon.png'), // will fallback if not exists
    autoHideMenuBar: true
  });

  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

// IPC Handlers
ipcMain.on('window-minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on('window-maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.on('window-close', () => {
  if (mainWindow) mainWindow.close();
});

// 1. Select files
ipcMain.handle('select-files', async (event, options) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: 'Videos', extensions: ['mp4', 'mov', 'avi', 'mkv', 'webm'] }
    ],
    ...options
  });
  return result.filePaths;
});

// 2. Select logo file
ipcMain.handle('select-logo', async (event) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'webp'] }
    ]
  });
  return result.filePaths[0] || null;
});

// 3. Select output folder
ipcMain.handle('select-output-folder', async (event) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  return result.filePaths[0] || null;
});

// 4. Load settings
ipcMain.handle('load-settings', () => {
  try {
    if (fs.existsSync(settingsPath)) {
      const data = fs.readFileSync(settingsPath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Failed to load settings:', err);
  }
  // Return defaults
  return {
    logoPath: '',
    outputResolution: 'original',
    cropEnabled: false,
    cropMode: 'none',
    theme: 'dark',
    cropX: 0,
    cropY: 0,
    cropW: 640,
    cropH: 480,
    reel: {
      position: 'bottom-right',
      size: 150,
      offset: 30,
      opacity: 100,
      rotation: 0,
      customPosEnabled: false,
      customX: 0.85,
      customY: 0.85
    },
    landscape: {
      position: 'top-right',
      size: 200,
      offset: 30,
      opacity: 100,
      rotation: 0,
      customPosEnabled: false,
      customX: 0.85,
      customY: 0.05
    },
    outputFolder: path.join(app.getPath('videos'), 'Watermarked')
  };
});

// 5. Save settings
ipcMain.handle('save-settings', (event, settings) => {
  try {
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2), 'utf-8');
    return { success: true };
  } catch (err) {
    console.error('Failed to save settings:', err);
    return { success: false, error: err.message };
  }
});

// 6. Get video details (to show aspect ratio, dimensions, orientation)
ipcMain.handle('get-video-details', async (event, filePath) => {
  return new Promise((resolve) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        resolve({ success: false, error: err.message });
        return;
      }
      const videoStream = metadata.streams.find(s => s.codec_type === 'video');
      if (!videoStream) {
        resolve({ success: false, error: 'No video stream found' });
        return;
      }

      // Handle orientation tags if they exist
      let width = videoStream.width;
      let height = videoStream.height;
      
      const orientation = (videoStream.side_data_list || []).find(d => d.side_data_type === 'Display Matrix');
      const rotation = metadata.format.tags && (metadata.format.tags.rotate || metadata.format.tags.rotation);
      
      // If rotated 90 or 270 degrees, swap width and height
      if (rotation === '90' || rotation === '270' || rotation === 90 || rotation === 270) {
        const temp = width;
        width = height;
        height = temp;
      }

      const isReel = height > width;
      const typeLabel = isReel ? 'Reel (Vertical)' : 'Landscape (Horizontal)';
      const duration = metadata.format.duration || 0;

      resolve({
        success: true,
        width,
        height,
        duration,
        isReel,
        typeLabel
      });
    });
  });
});

// 7. Cancel active processing
ipcMain.handle('cancel-processing', () => {
  if (activeFfmpegCommand) {
    activeFfmpegCommand.kill('SIGKILL');
    activeFfmpegCommand = null;
    return { success: true };
  }
  return { success: false, error: 'No active process' };
});

// 8. Process video
ipcMain.handle('process-video', async (event, { filePath, settings, videoType }) => {
  return new Promise((resolve) => {
    const logoPath = settings.logoPath;
    if (!logoPath || !fs.existsSync(logoPath)) {
      resolve({ success: false, error: 'Logo file not found' });
      return;
    }

    const outputFolder = settings.outputFolder;
    if (!fs.existsSync(outputFolder)) {
      fs.mkdirSync(outputFolder, { recursive: true });
    }

    const filename = path.basename(filePath);
    // Append suffix to avoid overwrite if output folder is same as input
    const baseNameWithoutExt = path.parse(filename).name;
    const ext = path.parse(filename).ext;
    const outPath = path.join(outputFolder, `${baseNameWithoutExt}_watermarked${ext}`);

    // Fetch video dimensions using ffprobe to compute proportional watermark scale
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        resolve({ success: false, error: `Failed to read video dimensions: ${err.message}` });
        return;
      }

      const videoStream = metadata.streams.find(s => s.codec_type === 'video');
      if (!videoStream) {
        resolve({ success: false, error: 'No video stream found' });
        return;
      }

      let videoWidth = videoStream.width;
      let videoHeight = videoStream.height;

      // Handle orientation matrices / rotate tag
      const rotationTag = metadata.format.tags && (metadata.format.tags.rotate || metadata.format.tags.rotation);
      if (rotationTag === '90' || rotationTag === '270' || rotationTag === 90 || rotationTag === 270) {
        const temp = videoWidth;
        videoWidth = videoHeight;
        videoHeight = temp;
      }

      // Build dynamic crop filter
      let videoFilters = '';
      const cropEnabled = settings.cropEnabled || false;
      if (cropEnabled) {
        const cropX = settings.cropX !== undefined ? parseInt(settings.cropX) : 0;
        const cropY = settings.cropY !== undefined ? parseInt(settings.cropY) : 0;
        const cropW = settings.cropW !== undefined ? parseInt(settings.cropW) : 640;
        const cropH = settings.cropH !== undefined ? parseInt(settings.cropH) : 480;
        videoFilters = `crop=${cropW}:${cropH}:${cropX}:${cropY}`;
      }

      // Determine target videoType post-crop to load correct watermark settings
      let activeVideoType = videoType;
      if (cropEnabled) {
        const cropW = settings.cropW || 640;
        const cropH = settings.cropH || 480;
        if (cropH > cropW) {
          activeVideoType = 'reel';
        } else {
          activeVideoType = 'landscape';
        }
      }

      // Get parameters depending on active video type
      const config = activeVideoType === 'reel' ? settings.reel : settings.landscape;
      const logoSize = parseInt(config.size) || 150;
      const offset = parseInt(config.offset) || 30;
      const opacity = config.opacity !== undefined ? parseInt(config.opacity) : 100;
      const rotation = config.rotation !== undefined ? parseInt(config.rotation) : 0;
      const position = config.position || 'bottom-right';

      // Get output resolution scaling parameter
      const resolution = settings.outputResolution || 'original';
      let targetWidth = 0;
      let targetHeight = 0;

      if (resolution !== 'original') {
        if (activeVideoType === 'reel') {
          if (resolution === '720p') { targetWidth = 720; targetHeight = 1280; }
          else if (resolution === '1080p') { targetWidth = 1080; targetHeight = 1920; }
          else if (resolution === '2k') { targetWidth = 1440; targetHeight = 2560; }
          else if (resolution === '4k') { targetWidth = 2160; targetHeight = 3840; }
        } else if (settings.cropMode === '1:1') {
          if (resolution === '720p') { targetWidth = 720; targetHeight = 720; }
          else if (resolution === '1080p') { targetWidth = 1080; targetHeight = 1080; }
          else if (resolution === '2k') { targetWidth = 1440; targetHeight = 1440; }
          else if (resolution === '4k') { targetWidth = 2160; targetHeight = 2160; }
        } else {
          if (resolution === '720p') { targetWidth = 1280; targetHeight = 720; }
          else if (resolution === '1080p') { targetWidth = 1920; targetHeight = 1080; }
          else if (resolution === '2k') { targetWidth = 2560; targetHeight = 1440; }
          else if (resolution === '4k') { targetWidth = 3840; targetHeight = 2160; }
        }
      }

      // Compute proportional logo sizing relative to the scale ratio
      const baseWidth = cropEnabled ? (settings.cropW || videoWidth) : videoWidth;
      const finalVideoWidth = (targetWidth > 0) ? targetWidth : baseWidth;
      
      const outputScale = finalVideoWidth / baseWidth;
      const finalLogoSize = Math.round(logoSize * outputScale);
      const finalOffset = Math.round(offset * outputScale);

      // Build FFmpeg overlay filter
      let xStr = '';
      let yStr = '';

      if (config.customPosEnabled) {
        const customX = config.customX !== undefined ? parseFloat(config.customX) : 0.85;
        const customY = config.customY !== undefined ? parseFloat(config.customY) : 0.85;
        xStr = `(main_w-overlay_w)*${customX}`;
        yStr = `(main_h-overlay_h)*${customY}`;
      } else {
        switch (position) {
          case 'top-left':
            xStr = `${finalOffset}`;
            yStr = `${finalOffset}`;
            break;
          case 'top-right':
            xStr = `main_w-overlay_w-${finalOffset}`;
            yStr = `${finalOffset}`;
            break;
          case 'bottom-left':
            xStr = `${finalOffset}`;
            yStr = `main_h-overlay_h-${finalOffset}`;
            break;
          case 'bottom-right':
            xStr = `main_w-overlay_w-${finalOffset}`;
            yStr = `main_h-overlay_h-${finalOffset}`;
            break;
          case 'center':
            xStr = `(main_w-overlay_w)/2`;
            yStr = `(main_h-overlay_h)/2`;
            break;
        }
      }

      // Build filter complex:
      // We scale the watermark input (input index 1) to the desired width, maintaining aspect ratio.
      // Then apply opacity via format=rgba,colorchannelmixer.
      // Then apply rotation via rotate.
      let logoFilters = `[1:v]scale=${finalLogoSize}:-2`;
      
      if (opacity < 100) {
        logoFilters += `,format=rgba,colorchannelmixer=aa=${(opacity / 100).toFixed(2)}`;
      }
      
      if (rotation !== 0) {
        if (opacity === 100) {
          logoFilters += `,format=rgba`;
        }
        logoFilters += `,rotate=${rotation}*PI/180:ow='rotw(${rotation}*PI/180)':oh='roth(${rotation}*PI/180)':c=black@0`;
      }
      
      logoFilters += `[logo]`;

      let filterComplex = '';
      let baseStream = '[0:v]';

      if (videoFilters) {
        filterComplex += `${baseStream}${videoFilters}[cropped];`;
        baseStream = '[cropped]';
      }

      if (targetWidth > 0) {
        filterComplex += `${baseStream}scale=w=${targetWidth}:h=${targetHeight}:force_original_aspect_ratio=decrease,pad=w=${targetWidth}:h=${targetHeight}:x='(ow-iw)/2':y='(oh-ih)/2':color=black[bg];`;
        baseStream = '[bg]';
      }

      filterComplex += `${logoFilters};${baseStream}[logo]overlay=x=${xStr}:y=${yStr}`;

      const command = ffmpeg()
        .input(filePath)
        .input(logoPath)
        .complexFilter(filterComplex)
        .output(outPath)
        .videoCodec('libx264')
        .outputOptions('-pix_fmt yuv420p') // for compatibility with web/phones
        .outputOptions('-preset medium'); // standard balance between speed and quality

      activeFfmpegCommand = command;

      command
        .on('start', (commandLine) => {
          console.log('Spawned FFmpeg with command: ' + commandLine);
        })
        .on('progress', (progress) => {
          // Send progress updates back to renderer
          event.sender.send('process-progress', {
            filePath,
            percent: progress.percent || 0
          });
        })
        .on('end', () => {
          activeFfmpegCommand = null;
          resolve({ success: true, outputPath: outPath });
        })
        .on('error', (err) => {
          activeFfmpegCommand = null;
          console.error('FFmpeg error:', err);
          resolve({ success: false, error: err.message });
        });

      command.run();
    });
  });
});

// 9. Open output folder in Explorer
ipcMain.handle('open-folder', async (event, folderPath) => {
  if (fs.existsSync(folderPath)) {
    shell.openPath(folderPath);
    return { success: true };
  }
  return { success: false, error: 'Folder does not exist' };
});

// 10. Open external URL in browser
ipcMain.handle('open-external', async (event, url) => {
  try {
    await shell.openExternal(url);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

