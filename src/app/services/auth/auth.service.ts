import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, first, map } from 'rxjs';
import { IAuthInfo } from '../../models/auth.model';
import { ConfigService } from '../config/config.service';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

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
  protected apiServer = '';
  private authSub: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  public get isAuthenticated(): Observable<boolean> {
    return this.authSub.asObservable();
  }

  constructor(
    private http: HttpClient,
    configService: ConfigService
  ) {
    configService.state$
      .pipe(
        first(config => config.isLoaded),
        map(({ data }) => data)
      )
      .subscribe(config => (this.apiServer = config?.apiServer || ''));
  }

  login(username: string, password: string) {
    return this.http
      .post(`${this.apiServer}/auth`, null, {
        headers: {
          Authorization: `Basic ${window.btoa(`${username}:${password}`)}`,
        },
      })
      .pipe(
        first(res => {
          this.setSession(<IAuthInfo>res);
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

  public isLoggedIn() {
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
}
