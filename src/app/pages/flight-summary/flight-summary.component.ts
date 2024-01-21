import { Component, OnInit } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FlightsService } from '../../services/flights/flights.service';
import { Flight } from '../../clients/flights.client';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-flight-summary',
  standalone: true,
  imports: [FlexLayoutModule, DatePipe, MatIconModule],
  templateUrl: './flight-summary.component.html',
  styleUrl: './flight-summary.component.scss',
})
export class FlightSummaryComponent implements OnInit {
  flight?: Flight;

  get fuelUsed() {
    const sortedEvents = this.flight?.log?.sort((a, b) => {
      return a.eventState.timestamp - b.eventState.timestamp;
    });
    if (!sortedEvents) return;

    const initialFuel = sortedEvents[0].eventState.weights.fuel;
    const endFuel =
      sortedEvents[sortedEvents.length - 1].eventState.weights.fuel;

    return Math.floor(initialFuel - endFuel);
  }

  constructor(
    private flightsService: FlightsService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const flightId = this.activatedRoute.snapshot.params['id'];
    this.flightsService.fetchFlight(flightId).subscribe(value => {
      this.flight = value;
    });
  }
}
