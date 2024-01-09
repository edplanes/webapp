import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import { registerIpcMain } from './ipc';
import { registerSimConnect } from './simconnect';
import EventEmitter from 'events';
import { RequestData } from './simconnect/types';
import { writeFileSync } from 'fs';
import { io, Socket } from 'socket.io-client';
import { logger } from './util/log';
import { RecvOpen } from 'node-simconnect';

let win: BrowserWindow | null = null;
const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve'),
  record = args.some(val => val === '--record'),
  local = args.some(val => val === '--local'),
  playback = args.some(val => val === '--playback');

function createWindow(): BrowserWindow {
  const size = {
    width: 1280,
    height: 720,
  };

  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    minHeight: 720,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: serve,
      contextIsolation: false,
    },
  });

  if (serve) {
    win.loadURL('http://localhost:4200');
  } else {
    const pathIndex = '../webapp/browser/index.html';

    const url = path.join(__dirname, pathIndex);
    win.loadFile(url);
  }

  win.on('closed', () => {
    win = null;
  });

  return win;
}

try {
  const eventer = new EventEmitter();
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on('ready', () => {
    setTimeout(() => {
      win = createWindow();
      logger.debug('App initializaiton...');
      eventer.on('flight:started', (flightId, token, recvOpen: RecvOpen) => {
        logger.debug('Flight started', flightId, recvOpen);
        win?.webContents.send('flight:started', flightId, recvOpen);
      });

      eventer.on('sim:dataReceived', data => {
        win?.webContents.send('sim:dataReceived', JSON.stringify(data));
      });

      eventer.on('flight:close', () => {
        logger.info('Closing flight...');
        win?.webContents.send('flight:close');
      });
      registerIpcMain(app);
      registerSimConnect(app, eventer, playback);
      logger.debug('App initialized successfully!');
    }, 400);
  });

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

  if (record) {
    const dataPoints: RequestData<unknown>[] = [];
    eventer.on('sim:dataReceived', data => {
      dataPoints.push(data);
    });

    process.on('exit', () => {
      writeFileSync('record.json', JSON.stringify(dataPoints));
    });
  }

  if (!local) {
    let socket: Socket | undefined;

    eventer.on('flight:started', (flightId: string, token: string) => {
      logger.info('Connecting...', flightId);
      socket = io(`ws://localhost:3000?flight=${flightId}&token=${token}`);
    });

    let buffer: unknown[] = [];

    eventer.on('sim:dataReceived', data => {
      if (socket?.connected && buffer.length > 0) {
        buffer.forEach(item => socket?.emit('sim:data', item));
        buffer = [];
      } else {
        if (!socket?.connected) {
          buffer.push(data);
          return;
        }
      }

      socket.emit('sim:data', data);
    });

    eventer.on('flight:closed', () => {
      logger.info('Closing reporting server connection...');
      socket?.disconnect();
    });

    // eventer.on('flight:closed', () => {
    //   logger.info('CLosing flight...');
    //   ws?.close();
    // });
  }
} catch (e) {
  // Catch Error
  // throw e;
}
