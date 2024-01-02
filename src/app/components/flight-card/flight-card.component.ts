import { Component, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { FlightsService } from '../../services/flights/flights.service';
import { Flight } from '../../clients/flights.client';
import { interval } from 'rxjs';
import { LogService } from '../../services/log/log.service';
import { FlightNotFoundError } from '../../services/flights/errors/FlightNotFoundError';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDialog } from '@angular/material/dialog';
import { FlightBookingComponent } from '../flight-booking/flight-booking.component';

@Component({
  selector: 'app-flight-card',
  standalone: true,
  imports: [
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule,
  ],
  templateUrl: './flight-card.component.html',
  styleUrl: './flight-card.component.scss',
})
export class FlightCardComponent implements OnInit {
  @Input() isNextFlight: boolean = false;
  nextFlight: Flight | undefined = undefined;

  constructor(
    private flightService: FlightsService,
    private logger: LogService,
    private bookFlightDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchFlight();
    interval(60000).subscribe(() => this.fetchFlight());
  }

  openBookFlightDialog() {
    this.bookFlightDialog.open(FlightBookingComponent);
  }

  private fetchFlight() {
    if (this.isNextFlight) this.fetchNextFlight();
    else this.fetchLastFlight();
  }

  private fetchNextFlight() {
    this.flightService.fetchNextFlight().subscribe({
      next: flight => {
        this.logger.debug('Fetched flight', flight);
        this.nextFlight = flight;
      },
      error: error => {
        if (error instanceof FlightNotFoundError) {
          this.nextFlight = undefined;
        }
      },
    });
  }

  private fetchLastFlight() {
    console.log(!this.isNextFlight);
  }
}
