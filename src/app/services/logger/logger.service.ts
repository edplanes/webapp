import { Injectable } from '@angular/core';
import { AuthState } from '../auth/authState';
import { ElectronService } from '../electron/electron.service';
import { LoggerState } from './logger.state';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  readonly loggerState = LoggerState.getInstance();
  private _connected = false;

  get isConnected() {
    return this._connected;
  }

  constructor(
    private authState: AuthState,
    private electronService: ElectronService
  ) {
    electronService.ipcRenderer.on('sim:connected', () => {
      this._connected = true;
    });
    electronService.ipcRenderer.on('flight:closed', () => {
      this._connected = false;
    });
  }

  startFlight(id: string) {
    if (this.loggerState.isInProgress) {
      throw new Error('Cannot start two flights at same time!');
    }

    this.loggerState.next(id, true);
  }
}
