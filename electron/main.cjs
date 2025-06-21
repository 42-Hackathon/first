const { app, BrowserWindow, Menu, ipcMain, globalShortcut, clipboard, nativeImage, screen } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

let mainWindow;
let stickyNoteWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1200,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    titleBarStyle: 'hiddenInset',
    vibrancy: 'ultra-dark',
    transparent: true,
    frame: false,
    show: false
  });

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../build/client/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createStickyNote() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  
  stickyNoteWindow = new BrowserWindow({
    width: 300,
    height: 400,
    x: width - 320,
    y: 20,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: true,
    minimizable: false,
    maximizable: false,
    show: false
  });

  if (isDev) {
    stickyNoteWindow.loadURL('http://localhost:5173/sticky-note');
  } else {
    stickyNoteWindow.loadFile(path.join(__dirname, '../build/client/sticky-note.html'));
  }

  stickyNoteWindow.once('ready-to-show', () => {
    stickyNoteWindow.show();
  });

  stickyNoteWindow.on('closed', () => {
    stickyNoteWindow = null;
  });
}

// App event listeners
app.whenReady().then(() => {
  createWindow();

  // Register global shortcuts
  globalShortcut.register('Alt+CommandOrControl+C', () => {
    if (stickyNoteWindow) {
      stickyNoteWindow.focus();
    } else {
      createStickyNote();
    }
  });

  globalShortcut.register('Alt+CommandOrControl+V', () => {
    const clipboardContent = clipboard.readText();
    if (mainWindow) {
      mainWindow.webContents.send('clipboard-content', clipboardContent);
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

// IPC handlers
ipcMain.handle('get-clipboard-content', () => {
  return clipboard.readText();
});

ipcMain.handle('set-clipboard-content', (event, content) => {
  clipboard.writeText(content);
});

ipcMain.handle('capture-screenshot', async () => {
  const { desktopCapturer } = require('electron');
  
  try {
    const sources = await desktopCapturer.getSources({
      types: ['screen'],
      thumbnailSize: { width: 1920, height: 1080 }
    });
    
    if (sources.length > 0) {
      return sources[0].thumbnail.toDataURL();
    }
  } catch (error) {
    console.error('Screenshot capture failed:', error);
    return null;
  }
});

ipcMain.handle('show-sticky-note', () => {
  if (stickyNoteWindow) {
    stickyNoteWindow.focus();
  } else {
    createStickyNote();
  }
});

ipcMain.handle('hide-sticky-note', () => {
  if (stickyNoteWindow) {
    stickyNoteWindow.hide();
  }
});

// Menu setup
const template = [
  {
    label: 'File',
    submenu: [
      {
        label: 'New Collection',
        accelerator: 'CmdOrCtrl+N',
        click: () => {
          mainWindow.webContents.send('new-collection');
        }
      },
      {
        label: 'Import',
        accelerator: 'CmdOrCtrl+I',
        click: () => {
          mainWindow.webContents.send('import-content');
        }
      },
      { type: 'separator' },
      {
        label: 'Quit',
        accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
        click: () => {
          app.quit();
        }
      }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' }
    ]
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  {
    label: 'Tools',
    submenu: [
      {
        label: 'Sticky Note',
        accelerator: 'Alt+CmdOrCtrl+C',
        click: () => {
          if (stickyNoteWindow) {
            stickyNoteWindow.focus();
          } else {
            createStickyNote();
          }
        }
      },
      {
        label: 'Quick Capture',
        accelerator: 'Alt+CmdOrCtrl+V',
        click: () => {
          const clipboardContent = clipboard.readText();
          mainWindow.webContents.send('clipboard-content', clipboardContent);
        }
      }
    ]
  },
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'close' }
    ]
  }
];

if (process.platform === 'darwin') {
  template.unshift({
    label: app.getName(),
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideOthers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  });
}

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);