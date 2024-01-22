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
import { Subscription, timer } from 'rxjs';

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
  subscription?: Subscription;

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

    this.subscription = timer(0, 30000).subscribe(() => {
      this.loggerService.fetchEvents(this.flightId).subscribe(events => {
        this.events = events.filter(event => event.name !== 'position_updated');
      });
    });
  }

  close() {
    this.loggerService.closeFlight(this.flightId);
    this.subscription?.unsubscribe();
    this.router.navigateByUrl('/user');
  }
}
