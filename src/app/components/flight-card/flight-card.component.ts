import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { FlightsService } from '../../services/flights/flights.service';
import { Flight } from '../../clients/flights.client';
import { Subscription, interval } from 'rxjs';
import { LogService } from '../../services/log/log.service';
import { FlightNotFoundError } from '../../services/flights/errors/FlightNotFoundError';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDialog } from '@angular/material/dialog';
import { FlightBookingComponent } from '../flight-booking/flight-booking.component';
import { DatePipe } from '@angular/common';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';
import { ElectronService } from '../../services/electron/electron.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterModule } from '@angular/router';
import { LoggerService } from '../../services/logger/logger.service';

@Component({
  selector: 'app-flight-card',
  standalone: true,
  imports: [
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule,
    DatePipe,
    MatTooltipModule,
    RouterModule,
  ],
  templateUrl: './flight-card.component.html',
  styleUrl: './flight-card.component.scss',
})
export class FlightCardComponent implements OnInit, OnDestroy {
  @Input() isNextFlight: boolean = false;
  flight: Flight | undefined = undefined;
  flightDistance: number = 0;
  private nextFlightFetcher: Subscription = new Subscription();

  constructor(
    private flightService: FlightsService,
    private logger: LogService,
    private bookFlightDialog: MatDialog,
    private startConfirmDialog: MatDialog,
    private cancelConfirmDialog: MatDialog,
    private electron: ElectronService,
    private router: Router,
    private flightLogger: LoggerService
  ) {}

  get flightTime() {
    const duration = this.flight!.duration;
    const flightHours = Math.floor(duration / 60);
    const flightMinutes = Math.floor(duration % 60);

    return `${String(flightHours).padStart(2, '0')}:${String(
      flightMinutes
    ).padStart(2, '0')}`;
  }

  get currentFlightState() {
    return {
      flightId: this.flightLogger.loggerState.value,
      isInProgress: this.flightLogger.isInProgress,
      isClosedOrDeleted:
        this.flight?.status === 'Closed' || this.flight?.status === 'Deleted',
    };
  }

  get isElectron() {
    return this.electron.isElectron;
  }

  ngOnInit(): void {
    this.fetchFlight();
    this.nextFlightFetcher = interval(60000).subscribe(() =>
      this.fetchFlight()
    );
  }

  ngOnDestroy(): void {
    this.nextFlightFetcher.unsubscribe();
  }

  openBookFlightDialog() {
    const dialogRef = this.bookFlightDialog.open(FlightBookingComponent);
    dialogRef.afterClosed().subscribe(() => this.fetchFlight());
  }

  startFlight() {
    const dialogRef = this.startConfirmDialog.open(MessageDialogComponent, {
      autoFocus: true,
      data: {
        message: `This will immediately initialize a connection with flight simulator and reporting service. Continue?`,
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      if (!this.flight) return;

      this.flightLogger.startFlight(this.flight.id);
      this.router.navigateByUrl(`logger/${this.flight?.id}`);
    });
  }

  cancelFlight() {
    const dialogRef = this.cancelConfirmDialog.open(MessageDialogComponent, {
      autoFocus: true,
      data: {
        message: 'Are you sure want to cancel flight?',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      result &&
        this.flightService
          .cancelFlight(this.flight!.id)
          .subscribe(() => this.fetchFlight());
    });
  }

  private fetchFlight() {
    if (this.isNextFlight) this.fetchNextFlight();
    else this.fetchLastFlight();
  }

  private fetchNextFlight() {
    this.flightService.fetchNextFlight().subscribe({
      next: flight => {
        this.logger.debug('Fetched flight', flight);
        this.flight = flight;
        this.flightDistance = Math.floor(
          this.flightService.calculateAirportsDistance(
            this.flight!.departure,
            this.flight!.arrival
          )
        );
      },
      error: error => {
        if (error instanceof FlightNotFoundError) {
          this.flight = undefined;
        }
      },
    });
  }

  private fetchLastFlight() {
    this.flightService.fetchPastFlights().subscribe({
      next: flights => {
        this.logger.debug('Fetched flights', flights);
        this.flight = flights.slice(-1)[0];
        this.flightDistance = Math.floor(
          this.flightService.calculateAirportsDistance(
            this.flight!.departure,
            this.flight!.arrival
          )
        );
      },
    });
  }
}
