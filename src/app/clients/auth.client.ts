import { Injectable } from '@angular/core';
import { ConfigService } from '../services/config/config.service';
import { Observable, first, map } from 'rxjs';
import { IAuthInfo, IUser } from '../models/auth.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthClient {
  private apiServerBaseUrl: string = '';

  constructor(
    private http: HttpClient,
    configService: ConfigService
  ) {
    configService.state$
      .pipe(
        first(config => config.isLoaded),
        map(({ data }) => data)
      )
      .subscribe(config => (this.apiServerBaseUrl = config?.apiServer || ''));
  }

  login(email: string, password: string) {
    return this.http.get<IAuthInfo>(`${this.apiServerBaseUrl}/auth`, {
      headers: {
        Authorization: `Basic ${window.btoa(`${email}:${password}`)}`,
      },
    });
  }

  register(
    username: string,
    homeAirportIcao: string,
    email: string,
    password: string
  ): Observable<IUser> {
    const body = {
      username,
      homeAirportIcao,
      email,
      password,
    };
    return this.http.post<IUser>(`${this.apiServerBaseUrl}/auth`, body);
  }
}
