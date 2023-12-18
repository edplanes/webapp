import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, first } from 'rxjs';
import { IAuthInfo } from '../../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(username: string, password: string) {
    return this.http.post("http://localhost:8080/api/auth", null, {
      headers: {
        "Authorization": `Basic ${window.btoa(`${username}:${password}`)}`
      },
    }).pipe(first((res) => {
      this.setSession(<IAuthInfo>res)
      return true
    }))
  }

  logout() {
    localStorage.removeItem('id_token')
    localStorage.removeItem('expires_at')
    localStorage.removeItem('user')
  }

  public isLoggedIn() {
    return Date.now() < this.getExpiration()
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  private setSession(authResult: IAuthInfo) {
    localStorage.setItem('id_token', authResult.token)
    localStorage.setItem('expires_at', JSON.stringify(authResult.expiresAt.valueOf()))
    localStorage.setItem('user',JSON.stringify(authResult.payload))
  }

  private getExpiration() {
    const expiry = localStorage.getItem('expires_at')!
    const expiresAt: number = JSON.parse(expiry)
    return expiresAt
  }

}
