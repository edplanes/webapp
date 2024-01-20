import { Component } from '@angular/core';
import { AirframeTableComponent } from '../../components/airframe-table/airframe-table.component';

@Component({
  selector: 'app-airframes',
  standalone: true,
  imports: [AirframeTableComponent],
  templateUrl: './airframes.component.html',
  styleUrl: './airframes.component.scss',
})
export class AirframesComponent {}
