// Puente seguro entre la app y Windows: solo lo justo para guardar copias en la carpeta del programa
const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('TOKERS_PC', {
  dataDir: ipcRenderer.sendSync('tokers:dataDir'),
  saveProjectCopy: (name, text) => ipcRenderer.invoke('tokers:saveProjectCopy', name, text),
  openDataFolder: () => ipcRenderer.invoke('tokers:openDataFolder'),
  toggleFullScreen: () => ipcRenderer.invoke('tokers:fullscreen'),
});
