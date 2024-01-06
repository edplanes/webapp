import { Component, OnInit } from '@angular/core';
import { LoginFormComponent } from '../../components/login-form/login-form.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { RequestData } from '../../../../app/simconnect/types';
import { ElectronService } from '../../services/electron/electron.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [LoginFormComponent, MatExpansionModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  receivedEvents: RequestData<unknown>[] = [];

  constructor(private electron: ElectronService) {}

  ngOnInit(): void {
    this.electron.ipcRenderer.on('sim:positionRequestReceived', (_, data) => {
      this.receivedEvents.push(data);
    });
    this.electron.ipcRenderer.on('sim:gearRequestReceived', (_, data) => {
      this.receivedEvents.push(data);
    });
    this.electron.ipcRenderer.on('sim:lightsRequestReceived', (_, data) => {
      this.receivedEvents.push(data);
    });
    this.electron.ipcRenderer.on('sim:flapsRequestReceived', (_, data) => {
      this.receivedEvents.push(data);
    });
  }

  startFlight() {
    this.electron.ipcRenderer.invoke('sim:connect');
  }
}
