# Markify Pro — Ultimate Bulk Video Watermarker for Creators & Editors

Markify Pro is an advanced, high-fidelity desktop application engineered for high-performance batch video watermarking. Designed specifically for content creators, social media marketing agencies, and professional editors, Markify Pro automatically detects, groups, crops, scales, and overlays watermarks onto both vertical formats (Reels, TikTok, YouTube Shorts - 9:16) and widescreen formats (Landscape - 16:9) simultaneously. 

Built using Electron, HTML5/CSS3, and localized high-performance FFmpeg/FFprobe binaries, Markify Pro runs 100% locally on your machine, ensuring full data privacy, zero subscription fees, and lightning-fast offline processing.

---

## 📥 Downloads (Pre-compiled Production Releases)

Get the latest stable production release of Markify Pro for Windows 10/11:

*   **💾 [Download Windows Installer Setup (v1.0.0)](https://github.com/ayshdan/markify/releases/download/v1.0.0/Markify-Setup-1.0.0.exe)**  
    *Recommended for standard installation. Creates a desktop shortcut and registers the app under system programs.*
*   **⚡ [Download Windows Portable Zip (v1.0.0)](https://github.com/ayshdan/markify/releases/download/v1.0.0/Markify-Portable.zip)**  
    *Standalone portable version. No installation required; unzip and run `Markify.exe` instantly from any folder or USB drive.*

---

## ✨ Key Features & Capabilities

*   **🚀 High-Speed Batch Processing**: Import dozens of videos at once and apply custom watermark designs in parallel.
*   **📂 Intelligent Layout Auto-Detection**: Automatically identifies video orientation (Portrait vs. Landscape) and applies separate watermark settings (size, offset, rotation, opacity, and corner positions) for each.
*   **✂️ Dynamic Video Cropping**: Drag-and-drop coordinate-precise manual crop borders with aspect ratio locks (1:1 Square, 9:16 Vertical, 16:9 Landscape).
*   **🖱️ Drag-and-Drop Logo Alignment**: Align your logo on the live preview player manually by dragging, or align to 9 standard grid anchors.
*   **🎬 Visual Preview Player**: Real-time player preview, seek timeline, volume controls, and mute toggles.
*   **🌗 High-Fidelity Monochromatic Themes**: Features premium Dark Charcoal and Clean Light themes matching modern Windows 11 and macOS interface principles.
*   **🔒 Strict Offline Privacy**: Zero remote API calls or background updates. Your video assets are processed locally and never uploaded to the internet.

---

## 🛠️ User Workflow Guide

1.  **Select Your Logo & Output Directory**:
    *   Browse and select your branding logo (`.png`, `.jpg`, `.webp` supported; transparent PNG recommended).
    *   Set the target destination directory where watermarked videos will be saved.
2.  **Import Your Media**:
    *   Drag and drop files into the import dropzone, or click to browse files.
    *   Multiple files are imported instantly. Markify Pro will list them in a numbered queue with automatic resolution, aspect ratio, duration, and orientation tags.
3.  **Adjust Watermark Settings**:
    *   Select any video in the queue to load it into the Live Preview player.
    *   Click on the **Reels** or **Landscape** tabs in the sidebar to configure independent properties (Size, Offset margins, Opacity transparency, and Rotation angle).
    *   Toggle **Crop Video** if you need to extract specific frame dimensions before watermarking.
4.  **Perform Deletion & Clearing Operations**:
    *   Check individual checkboxes in the list to select specific videos, or check the header checkbox to select all.
    *   Click **Delete Selected** to clear only checked videos, or click **Clear All** to clear the entire queue.
5.  **Process and Export**:
    *   To watermark a single video from the queue, click the **Export (Save Icon)** button on its row.
    *   To watermark all videos in the queue in sequence, click **Start Watermarking** at the bottom left.
    *   Watch real-time progress indicators on each row and on the overall progress bar. Markify Pro will automatically launch your output folder upon completion.

---

## ⌨️ Keyboard Shortcuts (Live Preview Player)

Enhance your editing speed using standard keyboard shortcuts:
*   <kbd>Spacebar</kbd> — Play / Pause video playback
*   <kbd>M</kbd> — Mute / Unmute player audio
*   <kbd>Left Arrow</kbd> — Seek backward by 5 seconds
*   <kbd>Right Arrow</kbd> — Seek forward by 5 seconds
*   <kbd>Up Arrow</kbd> — Increase player volume (by 10%)
*   <kbd>Down Arrow</kbd> — Decrease player volume (by 10%)

---

## 💻 Local Development Setup

### System Requirements
*   Node.js (version 18 or above recommended)
*   Windows 10 / 11

### Installation
1.  Clone the repository:
    ```bash
    git clone https://github.com/ayshdan/markify.git
    cd markify
    ```
2.  Install packages and build dependencies:
    ```bash
    npm install
    ```
3.  Launch the app in hot-reloaded development mode:
    ```bash
    npm start
    ```

### Packaging Production Binary Executables
To compile and bundle both the setup installer and the portable executable:
```bash
npm run package
```
All outputs (installer and zipped portable versions) will be compiled into the local `dist/` directory.

---

## 📞 Support & Inquiries

Markify Pro is developed and maintained by **Ayshdan**. For commercial setup support, customized bulk editing setups, licensing inquiries, or feature additions:

*   **🌐 Official Website**: [www.ayshdan.com](http://www.ayshdan.com)
*   **📧 Email Support**: [info.ayshdan@gmail.com](mailto:info.ayshdan@gmail.com)
*   **💬 WhatsApp Support Pakistan**: [+92 347 7876648](https://wa.me/923477876648)
*   **📢 WhatsApp Channel**: [Markify Community Channel](https://whatsapp.com/channel/0029Vb0YTwj5q08e1my4tK1i)

---

## ⚖️ License
Markify Pro is released under the **MIT License**. Copyright (c) 2026 Ayshdan (Markify Pakistan). See the license details below:

```text
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
```
