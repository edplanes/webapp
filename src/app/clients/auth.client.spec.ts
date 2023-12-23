import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthClient } from './auth.client';
import { TestBed } from '@angular/core/testing';
import { IAuthInfo } from '../models/auth.model';
import { HttpErrorResponse } from '@angular/common/http';

describe('Auth API Client', () => {
  let client: AuthClient;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    client = TestBed.inject(AuthClient);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
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

    client.login('test@email.local', 'some-pass').subscribe({
      next: authInfo => {
        expect(authInfo)
          .withContext('expected authentication info')
          .toBe(expectedAuthInfo);
        done();
      },
      error: done.fail,
    });
    httpController
      .expectOne({
        method: 'GET',
        url: '/auth',
      })
      .flush(expectedAuthInfo);
  });

  it('should return error', (done: DoneFn) => {
    const errorResponse: HttpErrorResponse = new HttpErrorResponse({
      error: 'Not found',
      status: 404,
    });

    client.login('test@email.local', 'some-pass').subscribe({
      error: (error: HttpErrorResponse) => {
        expect(error.status).toEqual(errorResponse.status);
        expect(error.error).toEqual(errorResponse.error);
        done();
      },
    });
    httpController
      .expectOne({
        method: 'GET',
        url: '/auth',
      })
      .flush(errorResponse.error, {
        status: errorResponse.status,
        statusText: errorResponse.error,
      });
  });
});
