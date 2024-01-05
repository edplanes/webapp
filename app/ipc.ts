import { ipcMain } from 'electron';
import { getWindow } from './util/window';

export const registerIpcMain = (app: Electron.App) => {
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
