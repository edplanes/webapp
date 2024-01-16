import { FlightsTableComponent } from './../../components/flights-table/flights-table.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { FlightBookingComponent } from '../../components/flight-booking/flight-booking.component';
import { FlightsService } from '../../services/flights/flights.service';
import { Flight } from '../../clients/flights.client';

@Component({
  selector: 'app-my-flights',
  standalone: true,
  imports: [
    FlightsTableComponent,
    MatFormFieldModule,
    MatInputModule,
    FlexLayoutModule,
    MatButtonModule,
  ],
  templateUrl: './my-flights.component.html',
  styleUrl: './my-flights.component.scss',
})
export class MyFlightsComponent implements OnInit {
  @ViewChild(FlightsTableComponent) table!: FlightsTableComponent;
  set flights(value: Flight[]) {
    this.table.flights = value;
    this.table.ngOnInit();
  }

  constructor(
    private bookFlightDialog: MatDialog,
    private flightsService: FlightsService
  ) {}

  ngOnInit(): void {
    this.flightsService.fetchFlights().subscribe(flights => {
      this.flights = flights;
    });
  }

  applyFilter(event: Event) {
    const filter = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();

    if (filter !== '') {
      this.flightsService.fetchFlights().subscribe(flights => {
        this.flights = flights.filter(
          flight =>
            flight.callsign.includes(filter) ||
            flight.aircraft.name.includes(filter)
        );
      });
    } else {
      this.flightsService.fetchFlights().subscribe(flights => {
        this.flights = flights;
      });
    }
  }

  openBookFlightDialog() {
    const dialogRef = this.bookFlightDialog.open(FlightBookingComponent);
    dialogRef.afterClosed().subscribe(() => {
      this.flightsService.fetchFlights().subscribe(flights => {
        this.flights = flights;
      });
    });
  }
}
