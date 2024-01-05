import { BrowserWindow } from 'electron';

export const getWindow = () => {
  return BrowserWindow.getAllWindows().find(w => !w.isDestroyed());
};
