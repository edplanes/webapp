import { Component, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { RequestData } from '../../../../app/simconnect/types';
import { ElectronService } from '../../services/electron/electron.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatExpansionModule, JsonPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  receivedEvents: RequestData<unknown> | undefined;
  connected = '';

  constructor(private electron: ElectronService) {}

  ngOnInit(): void {
    this.electron.ipcRenderer.on('sim:connected', (_, data) => {
      this.connected = data;
    });
    this.electron.ipcRenderer.on('flight:closed', () => (this.connected = ''));
    this.electron.ipcRenderer.on('sim:dataReceived', (_, data) => {
      this.receivedEvents = data;
    });
  }

  startFlight() {
    if (!this.connected)
      this.electron.ipcRenderer.invoke('sim:connect', 'test');
    else this.electron.ipcRenderer.invoke('flight:close');
  }
}
