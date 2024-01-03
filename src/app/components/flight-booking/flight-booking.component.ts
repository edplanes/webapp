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

  get skipRouteSelection() {
    return this.flightType === 'scheduled';
  }

  constructor(
    private dialogRef: MatDialogRef<FlightBookingComponent>,
    private airportService: AirportService,
    private flightsService: FlightsService,
    private aircraftService: AircraftsService,
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

  ngOnInit(): void {
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
            this.filteredAircrafts = aircraft;
          });
        typeof value == 'object' && this.updateFlightDuration();
      });
  }

  onSubmit() {
    if (this.detailsForm.invalid) return;

    this.flightsService.bookFlight(this.detailsForm.value);
    this.dialogRef.close();
  }

  selectFlightType(flightType: string) {
    console.log(this.stepper!.steps.get(1)?.state);
    this.flightType = flightType;

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
