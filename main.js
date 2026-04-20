const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    // Ocultar el menú superior por defecto para que parezca más una app nativa
    autoHideMenuBar: true 
  });

  // Determinamos si estamos en desarrollo (Vite ejecutándose)
  const isDev = process.env.NODE_ENV !== 'development' && !app.isPackaged; 

  // Como usaremos concurrently, confiaremos en localhost en modo dev
  const devUrl = 'http://localhost:5173';

  if (!app.isPackaged) {
    // Cargamos el servidor de desarrollo de Vite
    mainWindow.loadURL(devUrl);
    // Opcional: Abrir las herramientas de desarrollador
    // mainWindow.webContents.openDevTools();
  } else {
    // En producción, cargamos el archivo index.html generado por Vite
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
