const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  selectFiles: (options) => ipcRenderer.invoke('select-files', options),
  selectLogo: () => ipcRenderer.invoke('select-logo'),
  selectOutputFolder: () => ipcRenderer.invoke('select-output-folder'),
  loadSettings: () => ipcRenderer.invoke('load-settings'),
  saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),
  getVideoDetails: (filePath) => ipcRenderer.invoke('get-video-details', filePath),
  processVideo: (data) => ipcRenderer.invoke('process-video', data),
  cancelProcessing: () => ipcRenderer.invoke('cancel-processing'),
  openFolder: (folderPath) => ipcRenderer.invoke('open-folder', folderPath),
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  minimizeWindow: () => ipcRenderer.send('window-minimize'),
  maximizeWindow: () => ipcRenderer.send('window-maximize'),
  closeWindow: () => ipcRenderer.send('window-close'),
  onProgress: (callback) => {
    const subscription = (event, data) => callback(data);
    ipcRenderer.on('process-progress', subscription);
    return () => {
      ipcRenderer.removeListener('process-progress', subscription);
    };
  }
});
