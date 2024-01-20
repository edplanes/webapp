import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import {
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import {
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  Airport,
  AirportService,
} from '../../services/airports/airport.service';
import { startWith } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { Aircraft } from '../../clients/aircrafts.client';
import { AircraftsService } from '../../services/aircrafts/aircrafts.service';
import { FlightsService } from '../../services/flights/flights.service';
import { DurationPickerDirective } from '../../directives/duration-picker/duration-picker.directive';
import dayjs from 'dayjs';
import { Route, RoutesClient } from '../../clients/routes.client';

@Component({
  selector: 'app-flight-booking',
  standalone: true,
  imports: [
    MatStepperModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatAutocompleteModule,
    NgxMatTimepickerModule,
    DurationPickerDirective,
  ],
  templateUrl: './flight-booking.component.html',
  styleUrl: './flight-booking.component.scss',
})
export class FlightBookingComponent implements OnInit {
  @ViewChild('stepper') private stepper: MatStepper | undefined;
  flightType = '';
  detailsForm: FormGroup;
  filteredDepartures: Airport[] = [];
  filteredArrivals: Airport[] = [];
  filteredAircrafts: Aircraft[] = [];
  selectedRoute?: Route;
  routes: Route[] = [];

  get skipRouteSelection() {
    return this.flightType !== 'scheduled';
  }

  constructor(
    private dialogRef: MatDialogRef<FlightBookingComponent>,
    private airportService: AirportService,
    private flightsService: FlightsService,
    private aircraftService: AircraftsService,
    private routesClient: RoutesClient,
    fb: FormBuilder
  ) {
    this.detailsForm = fb.group({
      callsign: ['', Validators.required],
      departure: ['', Validators.required],
      arrival: ['', Validators.required],
      aircraft: ['', Validators.required],
      departureTime: ['', Validators.required],
      duration: [
        '01:00',
        [Validators.required, Validators.pattern(/[0-9]{2}:[0-9]{2}/)],
      ],
    });
  }

  private formatDate(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const paddedMonth = String(month).padStart(2, '0');
    const paddedDay = String(day).padStart(2, '0');
    const paddedHours = String(hours).padStart(2, '0');
    const paddedMinutes = String(minutes).padStart(2, '0');

    const formatted = `${year}-${paddedMonth}-${paddedDay}T${paddedHours}:${paddedMinutes}`;
    console.log(formatted);
    return formatted;
  }

  ngOnInit(): void {
    this.detailsForm.controls['departureTime'].setValue(
      this.formatDate(dayjs().add(15, 'minutes').toDate())
    );

    this.detailsForm.controls['departure'].valueChanges
      .pipe(startWith(''))
      .subscribe(value => {
        typeof value == 'string' &&
          this.airportService.searchAirport(value).subscribe(airports => {
            this.filteredDepartures = airports;
          });

        typeof value == 'object' && this.updateFlightDuration();
      });

    this.detailsForm.controls['arrival'].valueChanges
      .pipe(startWith(''))
      .subscribe(value => {
        typeof value == 'string' &&
          this.airportService.searchAirport(value).subscribe(airports => {
            this.filteredArrivals = airports;
          });
        typeof value == 'object' && this.updateFlightDuration();
      });

    this.detailsForm.controls['aircraft'].valueChanges
      .pipe(startWith(''))
      .subscribe(value => {
        typeof value == 'string' &&
          this.aircraftService.searchAircraft(value).subscribe(aircraft => {
            if (!this.selectedRoute) {
              this.filteredAircrafts = aircraft;
              return;
            }

            const routeAirframes = this.selectedRoute.allowedAirframes.map(
              aiframe => aiframe.icao
            );
            this.filteredAircrafts = aircraft.filter(
              aircraft => aircraft.airframe.icao in routeAirframes
            );
          });
        typeof value == 'object' && this.updateFlightDuration();
      });

    this.routesClient.fetchRoutes().subscribe(routes => {
      this.routes = routes;
    });
  }

  scheduleFlightSelected(routeIndex: number) {
    const route = this.routes[routeIndex];

    this.detailsForm.controls['callsign'].setValue(route.callsign);
    this.detailsForm.controls['departure'].setValue(route.departure);
    this.detailsForm.controls['arrival'].setValue(route.arrival);

    if (!this.skipRouteSelection) {
      this.detailsForm.controls['callsign'].disable();
      this.detailsForm.controls['departure'].disable();
      this.detailsForm.controls['arrival'].disable();
    }

    this.stepper?.next();
  }

  onSubmit() {
    if (this.detailsForm.invalid) return;

    this.flightsService.bookFlight({
      callsign: this.detailsForm.controls['callsign'].value,
      departure: this.detailsForm.controls['departure'].value,
      arrival: this.detailsForm.controls['arrival'].value,
      aircraft: this.detailsForm.controls['aircraft'].value,
      departureTime: this.detailsForm.controls['departureTime'].value,
      duration: this.detailsForm.controls['duration'].value,
    });
    this.dialogRef.close();
  }

  selectFlightType(flightType: string) {
    this.flightType = flightType;
    console.log(this.stepper!.steps.get(1)?.state, this.flightType);

    if (this.skipRouteSelection) {
      // Workaround until: https://github.com/angular/components/issues/17294
      setTimeout(() => this.stepper!.steps.get(2)?.select(), 10);
    }
    this.stepper!.next();
  }

  displayAirport(airport: Airport): string {
    return (airport && `${airport.icao} - ${airport.name}`) || '';
  }

  displayAircraft(aircraft: Aircraft) {
    return (
      aircraft &&
      `${aircraft.airframe.icao.toUpperCase()} - ${aircraft.name} - ${
        aircraft.airframe.name
      }`
    );
  }

  private updateFlightDuration() {
    const departure = this.detailsForm.controls['departure'].value;
    const arrival = this.detailsForm.controls['arrival'].value;
    const aircraft = this.detailsForm.controls['aircraft'].value;

    if (
      typeof departure !== 'object' ||
      typeof arrival !== 'object' ||
      typeof aircraft !== 'object'
    ) {
      return;
    }

    let flightTime = this.flightsService.calculateFlightTime(
      departure,
      arrival,
      aircraft
    );

    const flightHours = Math.floor(flightTime / 60);
    flightTime %= 60;
    const flightMinutes = Math.floor(flightTime);

    this.detailsForm.controls['duration'].setValue(
      String(flightHours).padStart(2, '0') +
        ':' +
        String(flightMinutes).padStart(2, '0')
    );
  }
}
