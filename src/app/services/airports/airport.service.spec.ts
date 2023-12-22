/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { AirportService } from './airport.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

describe('Service: Airport', () => {
  let service: AirportService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(AirportService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return empty array on empty search param', () => {
    service.searchAirport('').subscribe(airports => {
      expect(airports).toEqual([]);
    });
  });

  it('should return data received from API', () => {
    const expectedAirports = [
      {
        icao: 'EPAR',
        city: 'Bircza',
        location: {
          lat: 49.657501,
          lon: 22.514298,
          elev: 1455,
        },
        name: 'Arłamów Airport',
        score: 3,
      },
    ];

    service.searchAirport('ep').subscribe(airports => {
      expect(airports).toEqual(expectedAirports);
    });

    httpController.expectOne('/airports?search=ep').flush(expectedAirports);
  });
});
