import { Injectable } from '@angular/core';
import { FlightsClient } from '../../clients/flights.client';
import { AuthState } from '../auth/authState';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, first, throwError } from 'rxjs';
import { FlightNotFoundError } from './errors/FlightNotFoundError';
import { UnexpectedError } from '../../shared/errors/UnexpectedError';

@Injectable({
  providedIn: 'root',
})
export class FlightsService {
  constructor(
    private flightsClient: FlightsClient,
    private authState: AuthState
  ) {}

  fetchNextFlight() {
    const userId = this.authState.getValue()!.payload.id;

    return this.flightsClient
      .fetchNextFlight(userId)
      .pipe(catchError(this.handleError), first());
  }

  private handleError(err: HttpErrorResponse) {
    if (err.status == 404) {
      return throwError(() => new FlightNotFoundError(err.message));
    }

    return throwError(
      () => new UnexpectedError(err.message, err.name, err.url)
    );
  }
}
