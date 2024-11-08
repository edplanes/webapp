import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  ObservableInput,
  catchError,
  first,
  map,
  throwError,
} from 'rxjs';
import { IAuthInfo, IUser } from '../../models/auth.model';
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
  const authService = inject(AuthService);
  if (authService.isAuthenticated) return true;

  inject(Router).navigate(['/login'], {
    queryParams: { returnUrl: state.url },
  });
  return false;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public readonly authState: BehaviorSubject<IAuthInfo | undefined> =
    new BehaviorSubject<IAuthInfo | undefined>(undefined);

  public get authenticatedUser(): IUser | undefined {
    if (!this.isAuthenticated) return undefined;

    return this.authState.getValue()?.payload;
  }
  public get isAuthenticated(): boolean {
    const state = this.authState.getValue();
    return !!(Date.now() < (state?.expiresAt || 0) && state?.token);
  }

  constructor(
    private logger: LogService,
    private authClient: AuthClient
  ) {
    if (localStorage.getItem('id_token')) {
      const authInfo: IAuthInfo = {
        token: localStorage.getItem('id_token')!,
        payload: JSON.parse(localStorage.getItem('user')!),
        expiresAt: JSON.parse(localStorage.getItem('expires_at')!),
      };

      this.authState.next(authInfo);
    }
  }

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

  register(
    username: string,
    homeAiportIcao: string,
    email: string,
    password: string
  ) {
    return this.authClient
      .register(username, homeAiportIcao, email, password)
      .pipe(catchError(this.handleError.bind(this)));
  }

  logout() {
    this.authState.next(undefined);
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('user');
  }

  isLoggedIn(): Observable<boolean> {
    return this.authState
      .asObservable()
      .pipe(
        map(info => !!((info?.expiresAt || 0) > Date.now() && info?.token))
      );
  }

  private setSession(authResult: IAuthInfo) {
    this.authState.next(authResult);
    localStorage.setItem('id_token', authResult.token);
    localStorage.setItem(
      'expires_at',
      JSON.stringify(authResult.expiresAt.valueOf())
    );
    localStorage.setItem('user', JSON.stringify(authResult.payload));
  }

  private handleError(
    errorResponse: HttpErrorResponse
  ): ObservableInput<IAuthInfo> {
    this.logger.warn(
      `received ${errorResponse.status} status code, let's try handle it..`
    );

    switch (errorResponse.status) {
      case 403:
        this.logger.info(`user already exists: ${errorResponse.error}`);
        return throwError(() => new UserAlreadyExists());
      case 404:
        this.logger.info(`user not found: ${errorResponse.error}`);
        return throwError(() => new UserNotFound());
      case 401:
        this.logger.info(`unauthorized: ${errorResponse.error}`);
        return throwError(() => new Error('Bad credentials provided'));
      default:
        this.logger.fatal(`unknown error code received!`, errorResponse);
        return throwError(() => new Error('unknown error received'));
    }
  }
}
