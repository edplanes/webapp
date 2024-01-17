/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { APIClient } from '../shared/APIClient';
import { Airport } from '../services/airports/airport.service';

export interface Route {
  id: string;
  callsign: string;
  aircrafts: any[];
  duration: number;
  departure: Airport;
  arrival: Airport;
}

@Injectable({
  providedIn: 'root',
})
export class RoutesClient extends APIClient {
  fetchRoutes() {
    return this.http.get<Route[]>(`${this.apiServerBaseUrl}/routes`);
  }

  fetchRoute(routeId: string) {
    return this.http.get<Route>(`${this.apiServerBaseUrl}/routes/${routeId}`);
  }

  addRoute(route: Route) {
    return this.http.post(`${this.apiServerBaseUrl}/routes`, route);
  }

  updateRoute(routeId: string, route: Route) {
    return this.http.put(`${this.apiServerBaseUrl}/routes/${routeId}`, route);
  }

  deleteRoute(routeId: string) {
    return this.http.delete(`${this.apiServerBaseUrl}/routes/${routeId}`);
  }
}
