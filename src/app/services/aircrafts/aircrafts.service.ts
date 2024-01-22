import { Injectable } from '@angular/core';
import {
  Aircraft,
  AircraftsClient,
  Airframe,
} from '../../clients/aircrafts.client';

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

  addAircraft(aircraft: Aircraft) {
    return this.aircraftClient.addAircraft(aircraft);
  }

  updateAircraft(aircraft: Aircraft) {
    return this.aircraftClient.updateAircraft(aircraft);
  }

  deleteAircraft(id: string) {
    return this.aircraftClient.deleteAircraft(id);
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

  updateAirframe(airframe: Airframe) {
    return this.aircraftClient.updateAirframe(airframe);
  }

  deleteAirframe(id: string) {
    return this.aircraftClient.deleteAirframe(id);
  }
}
