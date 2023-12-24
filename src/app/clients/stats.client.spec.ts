import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { StatisticsDTO, StatsClient } from './stats.client';
import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';

describe('Client: Statistics', () => {
  let client: StatsClient;
  let httpController: HttpTestingController;
  let observableNextSpy = jasmine.createSpy('nextSpy');
  let observableErrorSpy = jasmine.createSpy('errorSpy');

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    client = TestBed.inject(StatsClient);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
    observableErrorSpy = jasmine.createSpy('errorSpy');
    observableNextSpy = jasmine.createSpy('nextSpy');
  });

  describe('method: getBasicStatistics', () => {
    const expectedStatistics: StatisticsDTO = {
      pilotReportsCount: 2,
      averageLandingRate: -191,
      inFlightSeconds: 6000,
      earnedPoints: 195,
      currentLocation: {
        icao: 'epgd',
        iata: 'gdn',
        city: 'Gdańsk',
        location: {
          lat: 54.377601623535156,
          lon: 18.46619987487793,
          elev: 489,
        },
        name: 'Gdańsk Lech Wałęsa Airport',
        score: 3,
      },
      mostFlownAircraftType: 'A320 neo',
    };

    it('return plain http response', () => {
      client.getBasicStatisticts('some-id').subscribe({
        next: observableNextSpy,
        error: observableErrorSpy,
      });

      httpController
        .expectOne({
          method: 'GET',
          url: '/user/some-id/stats',
        })
        .flush(expectedStatistics);

      expect(observableNextSpy).toHaveBeenCalledOnceWith(expectedStatistics);
      expect(observableErrorSpy).not.toHaveBeenCalled();
    });

    it('return error http response if error happened', () => {
      const errorResponse = new HttpErrorResponse({
        status: 404,
      });
      client.getBasicStatisticts('some-id').subscribe({
        next: observableNextSpy,
        error: observableErrorSpy,
      });

      httpController
        .expectOne({
          method: 'GET',
          url: '/user/some-id/stats',
        })
        .flush(null, errorResponse);

      expect(observableNextSpy).not.toHaveBeenCalled();
      expect(observableErrorSpy).toHaveBeenCalledTimes(1);
    });
  });
});
