/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { APIClient } from '../shared/APIClient';
import { IUser } from '../models/auth.model';
import { Airport } from '../services/airports/airport.service';

export enum FlightStatus {
  New = 'New',
  InProgress = 'InProgress',
  Closed = 'Closed',
  Deleted = 'Deleted',
}

export interface Flight {
  id: string;
  pilot: IUser;
  callsign: string;
  flightNumber: string;
  aircraft: any;
  status: FlightStatus;
  departureTime: Date;
  arrivalTime: Date;
  duration: number;
  departure: Airport;
  arrival: Airport;
  rating?: number;
  log?: any[];
  penalties?: any[];
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

  fetchPastFlights(userId: string) {
    return this.http.get<Flight[]>(
      `${this.apiServerBaseUrl}/users/${userId}/flights/past`
    );
  }

  fetchFlights(userId: string) {
    return this.http.get<Flight[]>(
      `${this.apiServerBaseUrl}/users/${userId}/flights`
    );
  }

  fetchFlightById(id: string) {
    return this.http.get<Flight>(`${this.apiServerBaseUrl}/flights/${id}`);
  }

  bookFlight(userId: string, flight: unknown) {
    return this.http.post(
      `${this.apiServerBaseUrl}/users/${userId}/flights`,
      flight
    );
  }

  cancelFlight(flightId: string) {
    return this.http.delete(`${this.apiServerBaseUrl}/flights/${flightId}`);
  }
}
