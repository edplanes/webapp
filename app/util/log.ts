import { getWindow } from './window';

type LogEntry = {
  message: string;
  level: string;
  params: unknown[];
};
let logEntry: LogEntry[] = [];

export const logger = {
  debug: (msg: string, ...params: unknown[]) => writeLog(msg, 'debug', params),
  info: (msg: string, ...params: unknown[]) => writeLog(msg, 'info', params),
  warn: (msg: string, ...params: unknown[]) => writeLog(msg, 'warn', params),
  error: (msg: string, ...params: unknown[]) => writeLog(msg, 'error', params),
  fatal: (msg: string, ...params: unknown[]) => writeLog(msg, 'fatal', params),
  log: (msg: string, ...params: unknown[]) => writeLog(msg, 'all', params),
};

function writeLog(msg: string, level: string, params: unknown[]) {
  const win = getWindow();

  if (!win) {
    setTimeout(() => writeLog(msg, level, params), 10000);
  } else {
    logEntry.forEach(({ message, level, params }) => {
      win?.webContents.send(`app:${level}`, message, params);
    });
    logEntry = [];
    win?.webContents.send(`app:${level}`, msg, params);
  }
}
