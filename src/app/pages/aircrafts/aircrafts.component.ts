import { Component } from '@angular/core';
import { AircraftTableComponent } from '../../components/aircraft-table/aircraft-table.component';
@Component({
  selector: 'app-aircrafts',
  standalone: true,
  imports: [AircraftTableComponent],
  templateUrl: './aircrafts.component.html',
  styleUrl: './aircrafts.component.scss',
})
export class AircraftsComponent {}
