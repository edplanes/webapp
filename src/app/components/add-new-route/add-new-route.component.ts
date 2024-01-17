import { MatIconModule } from '@angular/material/icon';
import { Component, OnInit } from '@angular/core';
import { Airframe } from '../../clients/aircrafts.client';
import {
  Airport,
  AirportService,
} from '../../services/airports/airport.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AircraftsService } from '../../services/aircrafts/aircrafts.service';
import { FlightsService } from '../../services/flights/flights.service';
import { FlightBookingComponent } from '../flight-booking/flight-booking.component';
import { startWith } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RoutesClient } from '../../clients/routes.client';

@Component({
  selector: 'app-add-new-route',
  standalone: true,
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatInputModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
    MatCheckboxModule,
    MatDialogModule,
  ],
  templateUrl: './add-new-route.component.html',
  styleUrl: './add-new-route.component.scss',
})
export class AddNewRouteComponent implements OnInit {
  routeForm: FormGroup;
  filteredDepartures: Airport[] = [];
  filteredArrivals: Airport[] = [];
  filteredAirframes: Airframe[] = [];
  selectedAirframes: Airframe[] = [];

  constructor(
    private dialogRef: MatDialogRef<FlightBookingComponent>,
    private airportService: AirportService,
    private flightsService: FlightsService,
    private aircraftService: AircraftsService,
    private routeClient: RoutesClient,
    fb: FormBuilder
  ) {
    this.routeForm = fb.group({
      callsign: ['', Validators.required],
      departure: ['', Validators.required],
      arrival: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.routeForm.controls['departure'].valueChanges
      .pipe(startWith(''))
      .subscribe(value => {
        typeof value === 'string' &&
          typeof value == 'string' &&
          this.airportService.searchAirport(value).subscribe(airports => {
            this.filteredDepartures = airports;
          });
      });

    this.routeForm.controls['arrival'].valueChanges
      .pipe(startWith(''))
      .subscribe(value => {
        typeof value == 'string' &&
          this.airportService.searchAirport(value).subscribe(airports => {
            this.filteredArrivals = airports;
          });
      });
  }

  displayAirport(airport: Airport): string {
    return (airport && `${airport.icao} - ${airport.name}`) || '';
  }

  displayAircraft(airframe: Airframe, short: boolean = false) {
    if (short) return airframe && airframe.icao.toUpperCase();
    return airframe && `${airframe.icao.toUpperCase()} - ${airframe.name}`;
  }

  onSubmit() {
    if (this.routeForm.invalid) {
      return;
    }
    this.routeClient
      .addRoute({
        ...this.routeForm.value,
        aircrafts: this.selectedAirframes,
      })
      .subscribe(console.log);
  }

  searchAircraft(event: Event) {
    const searchValue = (event.target as HTMLInputElement).value;

    this.aircraftService.searchAirframe(searchValue).subscribe(aircraft => {
      this.filteredAirframes = aircraft;
    });
  }

  addAirframeSelection(airframe: Airframe) {
    this.selectedAirframes.push(airframe);
  }

  removeAirframeSelection(airframe: Airframe) {
    this.selectedAirframes = this.selectedAirframes.filter(
      selectedAirframe => airframe.icao != selectedAirframe.icao
    );
  }
}
