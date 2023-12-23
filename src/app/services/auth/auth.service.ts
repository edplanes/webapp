import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  ObservableInput,
  catchError,
  first,
  throwError,
} from 'rxjs';
import { IAuthInfo } from '../../models/auth.model';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { LogService } from '../log/log.service';
import { UserAlreadyExists } from '../../shared/errors/UserAlreadyExists';
import { UserNotFound } from '../../shared/errors/UserNotFound';
import { AuthClient } from '../../clients/auth.client';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  if (inject(AuthService).isLoggedIn()) return true;

  inject(Router).navigate(['/login'], {
    queryParams: { returnUrl: state.url },
  });
  return false;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authSub: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  public get isAuthenticated(): Observable<boolean> {
    return this.authSub.asObservable();
  }

  constructor(
    private logger: LogService,
    private authClient: AuthClient
  ) {}

  login(email: string, password: string) {
    return this.authClient.login(email, password).pipe(
      catchError(this.handleError.bind(this)),
      first(res => {
        this.setSession(res);
        this.logger.debug(
          `User ${res.payload.email} authenticated, setting session...`
        );
        return true;
      })
    );
  }

  register() {}

  logout() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('user');
  }

  isLoggedIn() {
    return Date.now() < this.getExpiration();
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  private setSession(authResult: IAuthInfo) {
    localStorage.setItem('id_token', authResult.token);
    localStorage.setItem(
      'expires_at',
      JSON.stringify(authResult.expiresAt.valueOf())
    );
    localStorage.setItem('user', JSON.stringify(authResult.payload));
  }

  private getExpiration() {
    const expiry = localStorage.getItem('expires_at')!;
    const expiresAt: number = JSON.parse(expiry);
    return expiresAt;
  }

  private handleError(
    errorResponse: HttpErrorResponse
  ): ObservableInput<IAuthInfo> {
    this.logger.warn(
      `received ${errorResponse.status} status code, let's try handle it..`
    );

    switch (errorResponse.status) {
      case 409:
        this.logger.info(`user already exists: ${errorResponse.error}`);
        return throwError(() => new UserAlreadyExists());
      case 404:
        this.logger.info(`user not found: ${errorResponse.error}`);
        return throwError(() => new UserNotFound());
      default:
        this.logger.fatal(`unknown error code received!`, errorResponse);
        return throwError(() => new Error('unknown error received'));
    }
  }
}
