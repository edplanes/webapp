import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, inject } from '@angular/core';
import { BehaviorSubject, Observable, first, map } from 'rxjs';
import { IAuthInfo } from '../../models/auth.model';
import { ConfigService } from '../config/config.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  protected apiServer = '';
  private authSub: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  public get isAuthenticated(): Observable<boolean> {
    return this.authSub.asObservable();
  }

  constructor(private http: HttpClient) {
    inject(ConfigService)
      .state$.pipe(
        first(config => config.isLoaded),
        map(({ data }) => data)
      )
      .subscribe(config => (this.apiServer = config?.apiServer || ''));
  }

  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
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
