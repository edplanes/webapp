import { Component, ViewChild } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FlightsTableComponent } from '../../components/flights-table/flights-table.component';
import { FlightsService } from '../../services/flights/flights.service';
import { Flight } from '../../clients/flights.client';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-flights',
  standalone: true,
  imports: [
    FlightsTableComponent,
    MatFormFieldModule,
    MatInputModule,
    FlexLayoutModule,
    MatButtonModule,
  ],
  templateUrl: './user-flights.component.html',
  styleUrl: './user-flights.component.scss',
})
export class UserFlightsComponent {
  @ViewChild(FlightsTableComponent) table!: FlightsTableComponent;
  set flights(value: Flight[]) {
    this.table.flights = value;
    this.table.ngOnInit();
  }

  constructor(
    private flightsService: FlightsService,
    private route: ActivatedRoute
  ) {
    this.flightsService.fetchFlights().subscribe(flights => {
      this.flights = flights.filter(
        flight => flight.pilot.id === this.route.snapshot.params['id']
      );
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
            flight.pilot.id === this.route.snapshot.params['id'] &&
            (flight.callsign.includes(filter) ||
              flight.aircraft.name.includes(filter))
        );
      });
    } else {
      this.flightsService.fetchFlights().subscribe(flights => {
        this.flights = flights;
      });
    }
  }
}
