import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAuthInfo, IUser } from '../models/auth.model';
import { APIClient } from '../shared/APIClient';

@Injectable({
  providedIn: 'root',
})
export class AuthClient extends APIClient {
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
