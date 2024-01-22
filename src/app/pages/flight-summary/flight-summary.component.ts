import { Component, OnInit } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FlightsService } from '../../services/flights/flights.service';
import { Flight } from '../../clients/flights.client';
import { ActivatedRoute } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-flight-summary',
  standalone: true,
  imports: [
    FlexLayoutModule,
    DatePipe,
    MatIconModule,
    MatButtonModule,
    DecimalPipe,
  ],
  templateUrl: './flight-summary.component.html',
  styleUrl: './flight-summary.component.scss',
})
export class FlightSummaryComponent implements OnInit {
  flight?: Flight;
  landingResult?: {
    bounceCounter: number;
    averageTouchdownRate: number;
    averageGForce: number;
  };

  get penalties() {
    return this.flight?.penalties?.map(penalty => {
      return {
        ...penalty,
        name: penalty.name.replaceAll('_', ' '),
      };
    });
  }

  get events() {
    return this.flight?.log
      ?.filter(event => event.name !== 'position_updated')
      .map(event => {
        return {
          ...event,
          name: event.name.replaceAll('_', ' '),
        };
      });
  }

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
      this.fetchAverageLandingResult(value);
    });
  }

  private fetchAverageLandingResult(flight: Flight) {
    const landingEvents = flight.log?.filter(event => event.name === 'landing');

    this.landingResult = {
      bounceCounter: landingEvents?.length ?? 0,
      averageTouchdownRate:
        -landingEvents?.reduce(
          (acc, obj) => acc + obj.eventState.speed.touchDownRate,
          0
        ) / (landingEvents?.length ?? 1),
      averageGForce:
        landingEvents?.reduce(
          (acc, obj) => acc + obj.eventState.location.gforce,
          0
        ) / (landingEvents?.length ?? 1),
    };

    console.log(landingEvents, this.landingResult);
  }
}
