import { Injectable, inject } from '@angular/core';
import { ipcRenderer, webFrame } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';

export const electronGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const electronService = inject(ElectronService);
  if (electronService.isElectron && route.params['id']) return true;

  inject(Router).navigateByUrl('/');
  return false;
};

@Injectable({
  providedIn: 'root',
})
export class ElectronService {
  ipcRenderer!: typeof ipcRenderer;
  webFrame!: typeof webFrame;
  childProcess!: typeof childProcess;
  fs!: typeof fs;

  constructor() {
    if (this.isElectron) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;

      this.fs = window.require('fs');

      this.childProcess = window.require('child_process');
    }
  }

  closeApp() {
    this.ipcRenderer?.invoke('close');
  }

  minimizeWindow() {
    this.ipcRenderer?.invoke('minimize');
  }

  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }
}
