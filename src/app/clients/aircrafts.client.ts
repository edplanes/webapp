import { Injectable } from '@angular/core';
import { APIClient } from '../shared/APIClient';

export interface Airframe {
  id?: string;
  icao: string;
  name: string;
  purpose: string;
  category: string;
  size: string;
  limitations: AirframeLimitations;
  defaults: AirframeDefaults;
}

export type AirframeDefaults = {
  cruiseTAS: number;
};

export type AirframeLimitations = {
  weights: {
    maximumTakeoffWeight: number;
    maximumLandingWeight: number;
    operationalEmptyWeight: number;
    maximumZeroFuelWeight: number;
    maximumFuelOnBoard: number;
  };
};

export interface Aircraft {
  id?: string;
  name: string;
  airframe: Airframe;
  customWeights?: {
    maximumTakeoffWeight: number;
    maximumLandingWeight: number;
    operationalEmptyWeight: number;
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

  fetchAircrafts() {
    return this.http.get<Aircraft[]>(`${this.apiServerBaseUrl}/aircrafts`);
  }

  addAircraft(aircraft: Aircraft) {
    return this.http.post<Aircraft>(
      `${this.apiServerBaseUrl}/aircrafts`,
      aircraft
    );
  }

  updateAircraft(aircraft: Aircraft) {
    return this.http.put<Airframe>(
      `${this.apiServerBaseUrl}/aircraft/${aircraft.id}`,
      aircraft
    );
  }

  deleteAircraft(id: string) {
    return this.http.delete(`${this.apiServerBaseUrl}/aircrafts/${id}`);
  }

  searchAirframe(value: string) {
    return this.http.get<Airframe[]>(
      `${this.apiServerBaseUrl}/airframes?search=${value}`
    );
  }

  fetchAirframes() {
    return this.http.get<Airframe[]>(`${this.apiServerBaseUrl}/airframes`);
  }

  addAirframe(airframe: Airframe) {
    return this.http.post<Airframe>(
      `${this.apiServerBaseUrl}/airframes`,
      airframe
    );
  }

  updateAirframe(airframe: Airframe) {
    return this.http.put<Airframe>(
      `${this.apiServerBaseUrl}/airframes/${airframe.id}`,
      airframe
    );
  }

  deleteAirframe(id: string) {
    return this.http.delete(`${this.apiServerBaseUrl}/airframes/${id}`);
  }
}
