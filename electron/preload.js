const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Clipboard operations
  getClipboardContent: () => ipcRenderer.invoke('get-clipboard-content'),
  setClipboardContent: (content) => ipcRenderer.invoke('set-clipboard-content', content),
  
  // Screenshot capture
  captureScreenshot: () => ipcRenderer.invoke('capture-screenshot'),
  
  // Sticky note operations
  showStickyNote: () => ipcRenderer.invoke('show-sticky-note'),
  hideStickyNote: () => ipcRenderer.invoke('hide-sticky-note'),
  
  // Event listeners
  onClipboardContent: (callback) => {
    ipcRenderer.on('clipboard-content', (event, content) => callback(content));
  },
  
  onNewCollection: (callback) => {
    ipcRenderer.on('new-collection', () => callback());
  },
  
  onImportContent: (callback) => {
    ipcRenderer.on('import-content', () => callback());
  },
  
  // Remove listeners
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  }
});

// Expose a limited API for the sticky note window
contextBridge.exposeInMainWorld('stickyNoteAPI', {
  close: () => ipcRenderer.invoke('hide-sticky-note'),
  minimize: () => ipcRenderer.invoke('hide-sticky-note'),
  
  // Content operations
  saveNote: (content) => ipcRenderer.invoke('save-sticky-note', content),
  loadNote: () => ipcRenderer.invoke('load-sticky-note'),
  
  // Collection operations
  addToCollection: (content) => ipcRenderer.invoke('add-to-collection', content),
  quickCapture: () => ipcRenderer.invoke('quick-capture')
});