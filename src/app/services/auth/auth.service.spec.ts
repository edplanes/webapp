import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { IAuthInfo } from '../../models/auth.model';
import { LogService } from '../log/log.service';
import { UserNotFound } from '../../shared/errors/UserNotFound';
import { AuthClient } from '../../clients/auth.client';
import { of, throwError } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let client: AuthClient;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LogService, AuthClient],
    });
    client = TestBed.inject(AuthClient);
    service = TestBed.inject(AuthService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return auth info', (done: DoneFn) => {
    const expectedAuthInfo: IAuthInfo = {
      token: 'some-token',
      payload: {
        email: 'test@email.local',
        id: 'some-id',
      },
      expiresAt: 1703197072786,
    };
    const authClientSpy = spyOn(client, 'login');
    authClientSpy.and.returnValue(of(expectedAuthInfo));

    service.login('test@email.local', 'some-pass').subscribe({
      next: authInfo => {
        expect(authInfo)
          .withContext('expected authentication info')
          .toBe(expectedAuthInfo);
        done();
      },
      error: done.fail,
    });
  });

  it('should provide domain error instead of http error', (done: DoneFn) => {
    const errorResponse: HttpErrorResponse = new HttpErrorResponse({
      error: 'Not found',
      status: 404,
    });
    const authClientSpy = spyOn(client, 'login');
    authClientSpy.and.returnValue(throwError(() => errorResponse));

    service.login('test@email.local', 'some-pass').subscribe({
      error: (error: Error) => {
        expect(error).toBeInstanceOf(UserNotFound);
        done();
      },
    });
  });

  it('should update localstorage', () => {
    const expectedAuthInfo: IAuthInfo = {
      token: 'some-token',
      payload: {
        email: 'test@email.local',
        id: 'some-id',
      },
      expiresAt: 1703197072786,
    };
    const authClientSpy = spyOn(client, 'login');
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
