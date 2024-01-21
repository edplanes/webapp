import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoggerService } from '../../services/logger/logger.service';
import { ElectronService } from '../../services/electron/electron.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { JsonPipe } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-logger',
  standalone: true,
  imports: [
    FlexLayoutModule,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    JsonPipe,
    MatDividerModule,
  ],
  templateUrl: './logger.component.html',
  styleUrl: './logger.component.scss',
})
export class LoggerComponent implements OnInit {
  flightRunning: boolean = false;
  lastSimData: unknown;
  events: { name: string; entry: unknown }[] = [];

  get flightId() {
    return this.loggerService.loggerState.getValue()?.flightId;
  }

  get simulatorVersion() {
    const state = this.loggerService.loggerState.getValue().simDescription;

    if (!state) return 'unknown';

    return `${state.applicationBuildMajor}.${state.applicationBuildMinor}.${state.applicationVersionMajor}.${state.applicationVersionMinor}`;
  }

  constructor(
    private router: Router,
    private loggerService: LoggerService,
    private electronService: ElectronService
  ) {}

  ngOnInit(): void {
    this.loggerService.loggerState.subscribe(() => {
      this.flightRunning = this.loggerService.isConnected;
    });

    this.electronService.ipcRenderer.on('sim:dataReceived', (_, data) => {
      this.lastSimData = JSON.parse(data);
    });

    this.electronService.ipcRenderer.on('app:event:detected', (_, data) => {
      this.events = JSON.parse(data);
      this.events = this.events.filter(
        (_, index) => this.events.length - index < 50
      );
    });
  }

  close() {
    this.electronService.ipcRenderer.invoke('flight:close');
    this.router.navigateByUrl('/user');
  }
}
