// Toker's para PC (Windows). Programa portable: todo se guarda en la carpeta «Tokers-datos»,
// al lado del .exe. Si lo llevás en un pendrive, tus proyectos viajan con él.
const { app, BrowserWindow, protocol, net, session, shell, ipcMain, Menu } = require('electron');
const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');

// ---- carpeta de datos portable ----
function pickDataDir() {
  const near = process.env.PORTABLE_EXECUTABLE_DIR || path.dirname(app.getPath('exe'));
  const dir = path.join(near, 'Tokers-datos');
  try { fs.mkdirSync(dir, { recursive: true }); fs.accessSync(dir, fs.constants.W_OK); return dir; }
  catch (e) { return path.join(app.getPath('appData'), 'Tokers-datos'); }   // carpeta de solo lectura: se usa la del usuario
}
const DATA = app.isPackaged ? pickDataDir() : path.join(__dirname, 'Tokers-datos');
app.setPath('userData', path.join(DATA, 'sistema'));
const PROJ = path.join(DATA, 'Proyectos'), EXPORT = path.join(DATA, 'Exportados');
for (const d of [PROJ, EXPORT]) { try { fs.mkdirSync(d, { recursive: true }); } catch (e) {} }

// Una sola ventana a la vez (dos copias abiertas podrían pisarse los proyectos)
if (!app.requestSingleInstanceLock()) { app.quit(); }

// La app se sirve como «tokers://app/…»: dirección fija para que el navegador interno guarde los proyectos siempre en el mismo lugar
protocol.registerSchemesAsPrivileged([{ scheme: 'tokers', privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true, stream: true } }]);
const WWW = path.join(__dirname, 'www');

let win = null, closing = false;
function createWindow() {
  win = new BrowserWindow({
    width: 1366, height: 860, minWidth: 820, minHeight: 560, show: false,
    backgroundColor: '#0a0d0b', title: "Toker's", icon: path.join(__dirname, 'www', 'icon-512.png'),
    autoHideMenuBar: true,
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, sandbox: false, spellcheck: false, backgroundThrottling: false },
  });
  win.once('ready-to-show', () => { win.maximize(); win.show(); });
  win.loadURL('tokers://app/index.html');
  // enlaces externos: en el navegador de la PC
  win.webContents.setWindowOpenHandler(({ url }) => { if (/^https?:/.test(url)) shell.openExternal(url); return { action: 'deny' }; });
  win.webContents.on('will-navigate', (e, url) => { if (!url.startsWith('tokers://')) { e.preventDefault(); if (/^https?:/.test(url)) shell.openExternal(url); } });
  // F11 = pantalla completa · Ctrl+0/+/- no cambian el tamaño de la interfaz (el zoom es del dibujo)
  win.webContents.on('before-input-event', (e, input) => {
    if (input.type !== 'keyDown') return;
    if (input.key === 'F11') { win.setFullScreen(!win.isFullScreen()); e.preventDefault(); }
    if (input.key === 'F12' && input.control && input.shift) win.webContents.toggleDevTools();
  });
  win.webContents.setVisualZoomLevelLimits(1, 1);
  // Al cerrar: primero se guarda el proyecto abierto
  win.on('close', e => {
    if (closing) return;
    e.preventDefault(); closing = true;
    const done = () => { if (win && !win.isDestroyed()) win.destroy(); };
    setTimeout(done, 5000);
    win.webContents.executeJavaScript('(async () => { try { if (typeof xform !== "undefined" && xform) commitTransform(); if (typeof saveNow === "function") await saveNow(); if (typeof curProject !== "undefined" && curProject && typeof backupToPhone === "function") { curProject.changed = true; await backupToPhone(curProject); } } catch (e) {} })()')
      .catch(() => {}).finally(done);
  });
  win.on('closed', () => { win = null; });
}

app.on('second-instance', () => { if (win) { if (win.isMinimized()) win.restore(); win.focus(); } });

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  protocol.handle('tokers', req => {
    let rel = decodeURIComponent(new URL(req.url).pathname).replace(/^\/+/, '') || 'index.html';
    const file = path.normalize(path.join(WWW, rel));
    if (!file.startsWith(WWW)) return new Response('no', { status: 403 });
    return net.fetch(pathToFileURL(file).toString());
  });
  // Lo que se exporta (PNG, GIF, video, archivos .tokers): ventana de «Guardar como», empezando en Tokers-datos › Exportados
  session.defaultSession.on('will-download', (e, item) => {
    item.setSaveDialogOptions({ title: 'Guardar', defaultPath: path.join(EXPORT, item.getFilename()) });
  });
  session.defaultSession.setPermissionRequestHandler((wc, perm, cb) => cb(['media', 'clipboard-read', 'clipboard-sanitized-write', 'fullscreen'].includes(perm)));
  ipcMain.on('tokers:dataDir', e => { e.returnValue = DATA; });
  ipcMain.handle('tokers:saveProjectCopy', async (e, name, text) => {
    const safe = String(name || 'Proyecto').replace(/[\\/:*?"<>|]+/g, '_').slice(0, 80);
    await fs.promises.writeFile(path.join(PROJ, safe + '.tokers'), text, 'utf8'); return true;
  });
  ipcMain.handle('tokers:openDataFolder', () => shell.openPath(DATA));
  ipcMain.handle('tokers:fullscreen', () => { if (win) win.setFullScreen(!win.isFullScreen()); });
  createWindow();
});
app.on('window-all-closed', () => app.quit());
