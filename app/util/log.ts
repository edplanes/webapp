import { getWindow } from './window';

export function log(...data: unknown[]) {
  const window = getWindow();
  const string = data.map(value => {
    if (typeof value == 'object') {
      return JSON.stringify(value);
    } else {
      return value;
    }
  });
  window?.webContents.executeJavaScript(
    "console.log('%cFROM MAIN', 'color: #400', '" + string.join(' ') + "');"
  );
}
