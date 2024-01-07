import { Component, OnInit } from '@angular/core';
import { LoginFormComponent } from '../../components/login-form/login-form.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { RequestData } from '../../../../app/simconnect/types';
import { ElectronService } from '../../services/electron/electron.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [LoginFormComponent, MatExpansionModule, JsonPipe],
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
    this.electron.ipcRenderer.on('sim:positionRequestReceived', (_, data) => {
      this.receivedEvents = data;
    });
    this.electron.ipcRenderer.on('sim:gearRequestReceived', (_, data) => {
      this.receivedEvents = data;
    });
    this.electron.ipcRenderer.on('sim:lightsRequestReceived', (_, data) => {
      this.receivedEvents = data;
    });
    this.electron.ipcRenderer.on('sim:flapsRequestReceived', (_, data) => {
      this.receivedEvents = data;
    });
  }

  startFlight() {
    this.electron.ipcRenderer.invoke('sim:connect', 'test');
  }
}
