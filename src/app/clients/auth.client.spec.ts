import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthClient } from './auth.client';
import { TestBed } from '@angular/core/testing';
import { IAuthInfo, IUser } from '../models/auth.model';
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

  describe('login', () => {
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

  describe('register', () => {
    it('should return newly created user', () => {
      const user: IUser = {
        id: 'some-id',
        email: 'admin@localhost.com',
      };

      client.register('admin', 'epkt', user.email, 'some-password').subscribe({
        next: userRes => expect(userRes).toEqual(user),
      });
      httpController
        .expectOne({
          method: 'POST',
          url: '/auth',
        })
        .flush(user, {
          status: 201,
          statusText: 'Created',
        });
    });

    it('should return already exists error', () => {
      client
        .register('admin', 'epkt', 'admin@localhost.com', 'some-password')
        .subscribe({
          error: (err: HttpErrorResponse) => {
            expect(err.status).toEqual(409);
          },
        });
      httpController
        .expectOne({
          method: 'POST',
          url: '/auth',
        })
        .flush('User already exists', {
          status: 409,
          statusText: 'Conflict',
        });
    });
  });
});
