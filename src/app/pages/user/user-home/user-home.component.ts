import { Component, OnInit, ViewChild } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { StatsCardComponent } from '../../../components/stats-card/stats-card.component';
import { FlightCardComponent } from '../../../components/flight-card/flight-card.component';
import { FlightsTableComponent } from '../../../components/flights-table/flights-table.component';
import { Flight } from '../../../clients/flights.client';
import { FlightsService } from '../../../services/flights/flights.service';

@Component({
  selector: 'app-user-home',
  standalone: true,
  imports: [
    FlexLayoutModule,
    StatsCardComponent,
    FlightCardComponent,
    FlightsTableComponent,
  ],
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.scss',
})
export class UserHomeComponent implements OnInit {
  @ViewChild(FlightsTableComponent) table!: FlightsTableComponent;
  set flights(value: Flight[]) {
    this.table.flights = value;
    this.table.ngOnInit();
  }
  constructor(private flightsService: FlightsService) {}

  ngOnInit(): void {
    this.flightsService.fetchFlights().subscribe(flights => {
      this.flights = flights;
    });
  }
}
