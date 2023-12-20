import { Injectable, inject } from '@angular/core';
import { first, map, of } from 'rxjs';
import { ConfigService } from './config/config.service';
import { HttpClient } from '@angular/common/http';

export interface AirportLocation {
  lat: number;
  lon: number;
  elev: number;
}

export interface Airport {
  icao: string;
  city: string;
  location: AirportLocation;
  name: string;
  score: number;
}

@Injectable({
  providedIn: 'root',
})
export class AirportService {
  protected apiServer = '';

  constructor(private http: HttpClient) {
    inject(ConfigService)
      .state$.pipe(
        first(config => config.isLoaded),
        map(({ data }) => data)
      )
      .subscribe(config => (this.apiServer = config?.apiServer || ''));
  }

  searchAirport(search: string) {
    if (search == '') return of([]);

    return this.http.get<Airport[]>(
      `${this.apiServer}/airports?search=${search}`
    );
  }
}
