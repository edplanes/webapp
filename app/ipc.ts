import { BrowserWindow, ipcMain } from 'electron';

export const registerIpcMain = (app: Electron.App) => {
  const getWindow = () => {
    return BrowserWindow.getAllWindows().find((w) => !w.isDestroyed());
  };

  ipcMain.handle('close', () => {
    app.quit();
  });

  ipcMain.handle('maximize', () => {
    const win = getWindow();
    win?.maximize();
  });

  ipcMain.handle('minimize', () => {
    const win = getWindow();
    win?.minimize();
  });
};
