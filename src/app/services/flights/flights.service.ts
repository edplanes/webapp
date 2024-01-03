import { Injectable } from '@angular/core';
import { FlightsClient } from '../../clients/flights.client';
import { AuthState } from '../auth/authState';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, first, throwError } from 'rxjs';
import { FlightNotFoundError } from './errors/FlightNotFoundError';
import { UnexpectedError } from '../../shared/errors/UnexpectedError';
import { Airport } from '../airports/airport.service';
import { Aircraft } from '../../clients/aircrafts.client';
import { LogService } from '../log/log.service';

@Injectable({
  providedIn: 'root',
})
export class FlightsService {
  constructor(
    private flightsClient: FlightsClient,
    private authState: AuthState,
    private logger: LogService
  ) {}

  fetchNextFlight() {
    const userId = this.authState.getValue()!.payload.id;

    return this.flightsClient
      .fetchNextFlight(userId)
      .pipe(catchError(this.handleError), first());
  }

  bookFlight(flight: FlightInput) {
    const userId = this.authState.getValue()!.payload.id;

    this.flightsClient
      .bookFlight(userId, this.mapFlightInputToFlight(flight))
      .subscribe();
  }

  calculateFlightTime(
    airport1: Airport,
    airport2: Airport,
    aircraft: Aircraft
  ) {
    this.logger.debug('Calculate flight time...', aircraft, airport1, airport2);
    const taxiTakeoffTime =
      this.calculateTaxiTime(airport1) + this.calculateTaxiTime(airport2);

    const distance = this.calculateDistance(
      airport1.location.latitude,
      airport1.location.longitude,
      airport2.location.latitude,
      airport2.location.longitude
    );

    const flightTime =
      (distance / (aircraft.airframe.defaults.cruiseTAS * 1.852)) * 60;

    const totalFlightTimeInMinutes = taxiTakeoffTime + flightTime;

    this.logger.debug(
      `Got ${totalFlightTimeInMinutes} minutes`,
      taxiTakeoffTime,
      flightTime
    );

    return totalFlightTimeInMinutes;
  }

  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) {
    this.logger.debug('Calculating distance for:', lat1, lon1, lat2, lon2);
    const R = 6371e3;
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * (c / 1000);

    this.logger.debug(`Result: ${distance} km`);

    return distance;
  }

  private toRad(value: number) {
    return value * (Math.PI / 180);
  }

  private calculateTaxiTime(airport: Airport) {
    switch (airport.score) {
      case 0:
        return 40;
      case 1:
      case 2:
      case 3:
        return 0;
      case 4:
        return 5;
      case 5:
        return 10;
      case 6:
        return 20;
      default:
        return 25;
    }
  }

  private mapFlightInputToFlight(flightIn: FlightInput): unknown {
    return {
      callsign: flightIn.callsign,
      pilot: {
        id: this.authState.getValue()!.payload.id,
      },
      departure: {
        id: flightIn.departure.id,
      },
      arrival: {
        id: flightIn.arrival.id,
      },
      aircraft: {
        id: flightIn.aircraft.id,
      },
      departureTime: this.convertTimeToEpoch(flightIn.departureTime),
      duration: this.convertDurationStringToNumber(flightIn.duration),
    };
  }

  private convertTimeToEpoch(time: string) {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return new Date(`${year}-${month}-${day} ${time}`);
  }

  private convertDurationStringToNumber(duration: string) {
    const sectioned = duration.split(':');
    if (sectioned.length !== 2) {
      this.logger.error('Got unexpected duration string', duration);
      return;
    }

    return Number(sectioned[1]) + Number(sectioned[0]) * 60;
  }

  private handleError(err: HttpErrorResponse) {
    if (err.status == 404) {
      return throwError(() => new FlightNotFoundError(err.message));
    }

    return throwError(
      () => new UnexpectedError(err.message, err.name, err.url)
    );
  }
}

export interface FlightInput {
  callsign: string;
  departure: {
    id: string;
  };
  arrival: {
    id: string;
  };
  aircraft: {
    id: string;
  };
  departureTime: string;
  duration: string;
}
