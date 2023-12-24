import { Injectable } from '@angular/core';
import { Airport } from '../services/airports/airport.service';
import { APIClient } from '../shared/APIClient';
import { HttpClient } from '@angular/common/http';

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
  constructor(private http: HttpClient) {
    super();
  }

  getBasicStatisticts(userId: string) {
    return this.http.get<StatisticsDTO>(
      `${this.apiServerBaseUrl}/user/${userId}/stats`
    );
  }
}
