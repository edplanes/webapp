import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { IAuthInfo, IUser } from '../../models/auth.model';
import { LogService } from '../log/log.service';
import { UserNotFound } from '../../shared/errors/UserNotFound';
import { AuthClient } from '../../clients/auth.client';
import { of, throwError } from 'rxjs';
import { UserAlreadyExists } from '../../shared/errors/UserAlreadyExists';

describe('AuthService', () => {
  let service: AuthService;
  let authClient: AuthClient;
  let observableNextSpy: jasmine.Spy;
  let observableErrorSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LogService, AuthClient],
    });
    authClient = TestBed.inject(AuthClient);
    service = TestBed.inject(AuthService);
    observableNextSpy = jasmine.createSpy('nextSpy');
    observableErrorSpy = jasmine.createSpy('errorSpy');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    let authClientSpy: jasmine.Spy;

    beforeEach(() => {
      authClientSpy = spyOn(authClient, 'login');
    });

    it('should return auth info', () => {
      const expectedAuthInfo: IAuthInfo = {
        token: 'some-token',
        payload: {
          email: 'test@email.local',
          id: 'some-id',
          username: 'admin',
          roles: [],
        },
        expiresAt: 1703197072786,
      };
      authClientSpy.and.returnValue(of(expectedAuthInfo));

      service.login('test@email.local', 'some-pass').subscribe({
        next: observableNextSpy,
        error: observableErrorSpy,
      });

      expect(observableNextSpy).toHaveBeenCalledWith(expectedAuthInfo);
    });

    it('should provide domain error instead of http error', () => {
      const errorResponse: HttpErrorResponse = new HttpErrorResponse({
        status: 404,
      });
      authClientSpy.and.returnValue(throwError(() => errorResponse));

      service.login('test@email.local', 'some-pass').subscribe({
        error: observableErrorSpy,
      });

      expect(observableErrorSpy).toHaveBeenCalledOnceWith(new UserNotFound());
    });

    it('should update localstorage', () => {
      const expectedAuthInfo: IAuthInfo = {
        token: 'some-token',
        payload: {
          email: 'test@email.local',
          id: 'some-id',
          username: 'admin',
          roles: [],
        },
        expiresAt: 1703197072786,
      };
      authClientSpy.and.returnValue(of(expectedAuthInfo));

      service.login('test@email.local', 'some-pass').subscribe();

      expect(localStorage.getItem('id_token')).toBe(expectedAuthInfo.token);
      expect(Number(localStorage.getItem('expires_at'))).toBe(
        expectedAuthInfo.expiresAt
      );
      expect(localStorage.getItem('user')).toBe(
        JSON.stringify(expectedAuthInfo.payload)
      );
    });
  });

  describe('register', () => {
    let authClientSpy: jasmine.Spy;

    beforeEach(() => {
      authClientSpy = spyOn(authClient, 'register');
    });

    it('should return created user data', () => {
      const expectedUser: IUser = {
        id: 'some-id',
        email: 'test@localhost.com',
        username: 'admin',
        roles: [],
      };
      authClientSpy.and.returnValue(of(expectedUser));

      service
        .register('some', 'ntpl', 'test@localhost.com', 'other')
        .subscribe({
          next: observableNextSpy,
        });

      expect(observableNextSpy).toHaveBeenCalledWith(expectedUser);
    });

    it('should return domain error', () => {
      const errorResponse: HttpErrorResponse = new HttpErrorResponse({
        status: 403,
        error: 'user already exists',
      });
      authClientSpy.and.returnValue(throwError(() => errorResponse));

      service
        .register('some', 'ntpl', 'test@localhost.com', 'other')
        .subscribe({
          error: observableErrorSpy,
        });

      expect(observableErrorSpy).toHaveBeenCalledOnceWith(
        new UserAlreadyExists()
      );
    });
  });
});
