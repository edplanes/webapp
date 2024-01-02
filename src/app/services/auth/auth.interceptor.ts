import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const authState = this.authService.authState.getValue();

    if (!this.authService.isAuthenticated) return next.handle(req);

    const cloned = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + authState!.token),
    });

    return next.handle(cloned);
  }
}
