import { Injectable } from '@angular/core';
import { APIClient } from '../shared/APIClient';
import { IUser } from '../models/auth.model';
import { Airport } from '../services/airports/airport.service';

export enum FlightStatus {
  New,
  Opened,
  InProgress,
  Closed,
  Deleted,
}

export interface Flight {
  id: string;
  pilot: IUser;
  callsing: string;
  flightNumber: string;
  aircraft: unknown;
  status: FlightStatus;
  departureTime: Date;
  arrivalTime: Date;
  duration: number;
  departure: Airport;
  arrival: Airport;
}

@Injectable({
  providedIn: 'root',
})
export class FlightsClient extends APIClient {
  fetchNextFlight(userId: string) {
    return this.http.get<Flight>(
      `${this.apiServerBaseUrl}/users/${userId}/flights/next`
    );
  }

  bookFlight() {}
}
