import { Component } from '@angular/core';
import { FlightCardComponent } from '../../../components/flight-card/flight-card.component';
import { FlexLayoutModule } from '@angular/flex-layout';

@Component({
  selector: 'app-user-home',
  standalone: true,
  imports: [FlightCardComponent, FlexLayoutModule],
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.scss',
})
export class UserHomeComponent {}
