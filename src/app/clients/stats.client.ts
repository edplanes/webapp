import { Injectable } from '@angular/core';
import { Airport } from '../services/airports/airport.service';
import { APIClient } from '../shared/APIClient';

export interface StatisticsDTO {
  pilotReportsCount: number;
  averageLandingRate: number;
  inFlightSeconds: number;
  earnedPoints: number;
  currentLocation: Airport;
  mostFlownAircraftType: string;
}

@Injectable({
  providedIn: 'root',
})
export class StatsClient extends APIClient {
  getBasicStatisticts(userId: string) {
    return this.http.get<StatisticsDTO>(
      `${this.apiServerBaseUrl}/users/${userId}/stats`
    );
  }
}
