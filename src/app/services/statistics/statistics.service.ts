import { Injectable } from '@angular/core';
import { StatisticsDTO, StatsClient } from '../../clients/stats.client';
import { AuthService } from '../auth/auth.service';
import { Observable, catchError, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { StatisticsNotFoundError } from './errors/StatisticsNotFoundError';
import { UnexpectedError } from '../../shared/errors/UnexpectedError';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  constructor(
    private statsClient: StatsClient,
    private authService: AuthService
  ) {}

  getUserStatistics(userId: string): Observable<StatisticsDTO> {
    return this.statsClient
      .getBasicStatisticts(userId)
      .pipe(catchError(this.handleErrorFor(userId)));
  }

  private handleErrorFor(userId: string) {
    return (err: HttpErrorResponse) => {
      switch (err.status) {
        case 404:
          return throwError(() => new StatisticsNotFoundError(userId));
        default:
          return throwError(
            () =>
              new UnexpectedError(err.error, err.status, err.url, err.headers)
          );
      }
    };
  }
}
