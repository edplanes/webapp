import { Injectable } from '@angular/core';
import { AircraftsClient } from '../../clients/aircrafts.client';

@Injectable({
  providedIn: 'root',
})
export class AircraftsService {
  constructor(private aircraftClient: AircraftsClient) {}

  searchAircraft(search: string) {
    return this.aircraftClient.searchAircraft(search);
  }
}
