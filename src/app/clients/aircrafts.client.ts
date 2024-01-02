import { Injectable } from '@angular/core';
import { APIClient } from '../shared/APIClient';

export interface Airframe {
  icao: string;
  name: string;
  purpose: string;
  category: string;
  size: string;
  limitations: {
    weights: {
      maximumTakeoffWeight: number;
      maximumLandingWeight: number;
      operationaLEmptyWeight: number;
      maximumZeroFuelWeight: number;
      maximumFuelOnBoard: number;
    };
  };
  defaults: {
    cruiseTAS: number;
  };
}

export interface Aircraft {
  name: string;
  airframe: Airframe;
  customWeights: {
    maximumTakeoffWeight: number;
    maximumLandingWeight: number;
    operationaLEmptyWeight: number;
    maximumZeroFuelWeight: number;
    maximumFuelOnBoard: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AircraftsClient extends APIClient {
  searchAircraft(value: string) {
    return this.http.get<Aircraft[]>(
      `${this.apiServerBaseUrl}/aircrafts?search=${value}`
    );
  }
}
