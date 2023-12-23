import { Injectable } from '@angular/core';
import { ConfigService } from '../services/config/config.service';
import { first, map } from 'rxjs';
import { IAuthInfo } from '../models/auth.model';
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

  login(username: string, password: string) {
    return this.http.get<IAuthInfo>(`${this.apiServerBaseUrl}/auth`, {
      headers: {
        Authorization: `Basic ${window.btoa(`${username}:${password}`)}`,
      },
    });
  }
}
