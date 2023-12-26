import { TestBed } from '@angular/core/testing';

import { StatisticsService } from './statistics.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StatisticsDTO, StatsClient } from '../../clients/stats.client';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { StatisticsNotFoundError } from './errors/StatisticsNotFoundError';
import { UnexpectedError } from '../../shared/errors/UnexpectedError';

describe('StatisticsService', () => {
  let service: StatisticsService;
  let client: StatsClient;
  let observableNextSpy: jasmine.Spy;
  let observableErrorSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    client = TestBed.inject(StatsClient);
    service = TestBed.inject(StatisticsService);
    observableNextSpy = jasmine.createSpy('nextSpy');
    observableErrorSpy = jasmine.createSpy('errorSpy');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUserStatistics', () => {
    let clientSpy: jasmine.Spy;
    beforeEach(() => {
      clientSpy = spyOn(client, 'getBasicStatisticts');
    });

    it('return statistics DTO', () => {
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
      const userId = 'some-user-id';
      clientSpy.and.returnValue(of(expectedStatistics));

      service.getUserStatistics(userId).subscribe({
        next: observableNextSpy,
        error: observableErrorSpy,
      });

      expect(observableNextSpy).toHaveBeenCalledOnceWith(expectedStatistics);
      expect(clientSpy).toHaveBeenCalledWith(userId);
      expect(observableErrorSpy).not.toHaveBeenCalled();
    });

    it('return statistics not found error on 404 status', () => {
      const expectedError: HttpErrorResponse = new HttpErrorResponse({
        status: 404,
      });
      const userId = 'some-user-id';
      clientSpy.and.returnValue(throwError(() => expectedError));

      service.getUserStatistics(userId).subscribe({
        next: observableNextSpy,
        error: observableErrorSpy,
      });

      expect(observableErrorSpy).toHaveBeenCalledTimes(1);
      expect(observableErrorSpy.calls.mostRecent().args[0]).toBeInstanceOf(
        StatisticsNotFoundError
      );
    });

    it('return generic error on any other error response', () => {
      const expectedError: HttpErrorResponse = new HttpErrorResponse({
        status: 500,
      });
      const userId = 'some-user-id';
      clientSpy.and.returnValue(throwError(() => expectedError));

      service.getUserStatistics(userId).subscribe({
        next: observableNextSpy,
        error: observableErrorSpy,
      });

      expect(observableErrorSpy).toHaveBeenCalledTimes(1);
      expect(observableErrorSpy.calls.mostRecent().args[0]).toBeInstanceOf(
        UnexpectedError
      );
    });
  });
});
