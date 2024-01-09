import { Injectable } from '@angular/core';
import { ElectronService } from '../electron/electron.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject } from 'rxjs';
import type { RecvOpen } from 'node-simconnect';

export type LoggerState = {
  flightId: string;
  connected: boolean;
  simDescription?: RecvOpen;
};

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  readonly loggerState = new BehaviorSubject<LoggerState>({
    flightId: '',
    connected: false,
  });

  get isConnected() {
    const loggerState = this.loggerState.value;
    return loggerState.connected && !!loggerState.flightId;
  }

  get isInProgress() {
    return this.loggerState.value.connected;
  }

  constructor(
    private authService: AuthService,
    private electronService: ElectronService,
    private router: Router
  ) {
    electronService.ipcRenderer?.on(
      'flight:started',
      (_, flightId: string, simDescription: RecvOpen) => {
        this.loggerState.next({
          flightId: flightId,
          connected: true,
          simDescription: simDescription ?? undefined,
        });
      }
    );
    electronService.ipcRenderer?.on('flight:closed', () => {
      const state = this.loggerState.value.flightId;
      this.loggerState.next({
        flightId: state,
        connected: false,
        simDescription: undefined,
      });
    });
  }

  startFlight(id: string) {
    if (!this.electronService.isElectron) return;
    if (this.isInProgress) {
      throw new Error('Cannot start two flights at same time!');
    }

    this.electronService.ipcRenderer.invoke(
      'sim:connect',
      id,
      this.authService.authState.value?.token
    );
    this.loggerState.next({ flightId: id, connected: false });
  }

  closeFlight() {
    this.electronService.ipcRenderer.invoke('flight:close');
  }
}
