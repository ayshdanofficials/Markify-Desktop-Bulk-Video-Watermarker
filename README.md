# Markify Pro — Desktop Bulk Video Watermarker

Markify Pro is an offline desktop application designed for batch video watermarking. It is optimized for content creators, video editors, and social media managers who need to process large volumes of video files quickly and securely. The software automatically detects video orientation, separating portrait (Reels, TikTok, YouTube Shorts - 9:16) and landscape (Widescreen - 16:9) formats, applying distinct watermark configuration presets to each in parallel.

Built using Electron, HTML5/CSS3, and embedded FFmpeg/FFprobe binaries, Markify Pro runs entirely on your local machine, ensuring absolute data privacy and offline capability.

---

## Downloads

Official pre-compiled production binaries for Windows 10 and 11:

| Distribution Type | Description | Download Link |
| :--- | :--- | :--- |
| **Windows Installer Setup** | Standard system installer. Configures desktop shortcuts and registers the application within Windows programs. | [Download Markify Setup v1.0.0](https://github.com/ayshdanofficials/Markify-Desktop-Bulk-Video-Watermarker/releases/download/v1.0.0/Markify.Setup.1.0.0.exe) |
| **Windows Portable Archive** | Standalone portable release. Requires no installation. Extract the ZIP and execute `Markify.exe` instantly. | [Download Markify Portable ZIP](https://github.com/ayshdanofficials/Markify-Desktop-Bulk-Video-Watermarker/releases/download/v1.0.0/Markify-Portable.zip) |

---

## Core Capabilities

*   **Parallel Batch Processing**: Import multiple video files simultaneously to process and watermark them in a single batch operation.
*   **Automatic Layout Detection**: Automatically groups imported media into Portrait (Reels) or Landscape classes and applies independent parameters (dimensions, padding offsets, opacity, and rotation angles) to each class.
*   **Dynamic Video Cropping**: Fully integrated manual cropping interface with aspect ratio locking features (1:1 Square, 9:16 Vertical, 16:9 Landscape).
*   **Interactive Watermark Overlay**: Drag-and-drop watermark placement on the live preview player, or snap to any of the 9 standard grid anchor points.
*   **Integrated Media Player**: Real-time video player with a scrubbable timeline, play/pause controls, volume sliders, and mute options.
*   **Monochromatic Theme Engine**: High-fidelity Dark Charcoal and Clean Light themes that conform to modern OS interface design guidelines.
*   **Local Processing & Privacy**: Zero server dependency, external API requests, or background updates. All rendering operations are executed locally using embedded FFmpeg tools.

---

## User Workflow Guide

1.  **Configure Directories**:
    *   Click **Browse** in the logo configuration panel to select your watermark file (PNG, JPG, or WEBP files supported; transparent PNG files recommended).
    *   Define the output folder path where processed videos will be saved.
2.  **Import Files**:
    *   Drag and drop target video files into the dashed dropzone area, or click to browse files locally.
    *   Videos will appear in the queue list, displaying index numbering, filename, duration, resolution, layout category, and status indicators.
3.  **Adjust Watermark Properties**:
    *   Select any video in the list to load it into the preview player.
    *   Use the sidebar panels to adjust size, offset margin, opacity, and rotation settings.
    *   If cropping is required, check the **Crop Video** checkbox and define boundaries manually on-screen or select a preset from the crop dropdown menu.
4.  **Manage Queue List**:
    *   Check individual checkboxes to select specific items, or toggle the top checkbox to select the entire list.
    *   Use **Delete Selected** to remove targeted files from the queue, or **Clear All** to clear the list.
5.  **Export and Process**:
    *   To export a single video individually, click the **Export (Save)** icon on its row.
    *   To process the entire queue sequentially, click **Start Watermarking** at the bottom of the sidebar.
    *   Monitor status logs and progress bars. The target output folder will open automatically once processing is complete.

---

## Keyboard Shortcuts

Manage the live preview player using the following key bindings:

| Key | Action |
| :--- | :--- |
| `Spacebar` | Play / Pause video playback |
| `M` | Mute / Unmute player audio |
| `Left Arrow` | Seek backward by 5 seconds |
| `Right Arrow` | Seek forward by 5 seconds |
| `Up Arrow` | Increase player volume by 10% |
| `Down Arrow` | Decrease player volume by 10% |

---

## Local Development & Compilation

### Prerequisites
*   Node.js (version 18 or above recommended)
*   Windows 10 / 11

### Installation Steps
1.  Clone the repository:
    ```bash
    git clone https://github.com/ayshdanofficials/Markify-Desktop-Bulk-Video-Watermarker.git
    cd Markify-Desktop-Bulk-Video-Watermarker
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Launch the application in development mode:
    ```bash
    npm start
    ```

### Packaging Binaries
To build the setup installer and the portable executable:
```bash
npm run package
```
Compiled targets will be generated inside the `dist/` directory.

---

## Support & Contacts

For licenses, enterprise customizations, or technical assistance:

| Channel | Contact Reference |
| :--- | :--- |
| **Website** | [www.ayshdan.com](http://www.ayshdan.com) |
| **Email** | [info.ayshdan@gmail.com](mailto:info.ayshdan@gmail.com) |
| **WhatsApp Support (Pakistan)** | [+92 347 7876648](https://wa.me/923477876648) |
| **WhatsApp Community** | [Markify Community Channel](https://whatsapp.com/channel/0029Vb0YTwj5q08e1my4tK1i) |

---

## License

This software is released under the **MIT License**. Copyright (c) 2026 Ayshdan (Markify Pakistan).

```text
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
```
