import { Injectable } from '@angular/core';
import { AircraftsClient, Airframe } from '../../clients/aircrafts.client';

@Injectable({
  providedIn: 'root',
})
export class AircraftsService {
  constructor(private aircraftClient: AircraftsClient) {}

  searchAircraft(search?: string) {
    if (!search) {
      return this.aircraftClient.fetchAircrafts();
    }

    return this.aircraftClient.searchAircraft(search);
  }

  searchAirframe(search?: string) {
    if (!search) {
      return this.aircraftClient.fetchAirframes();
    }

    return this.aircraftClient.searchAirframe(search);
  }

  addAirframe(airframe: Airframe) {
    return this.aircraftClient.addAirframe(airframe);
  }
}
