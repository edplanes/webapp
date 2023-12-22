import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { IAuthInfo } from '../../models/auth.model';
import { Observable, catchError, of, throwError } from 'rxjs';
import { ConfigService, ConfigState } from '../config/config.service';

class MockedConfigService extends ConfigService {
  public override state$: Observable<ConfigState> = of({
    isLoaded: true,
    data: {
      apiServer: 'http://test/api',
    },
  });
}

describe('AuthService', () => {
  let service: AuthService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: ConfigService,
          useClass: MockedConfigService,
        },
      ],
    });
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

    service.login('test@email.local', 'some-pass').subscribe({
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
        url: 'http://test/api/auth',
      })
      .flush(expectedAuthInfo);
  });

  it('should pass error response', (done: DoneFn) => {
    const errorResponse: HttpErrorResponse = new HttpErrorResponse({
      error: 'Not found',
      status: 404,
    });

    service
      .login('test@email.local', 'some-pass')
      .pipe(
        catchError((error: HttpErrorResponse) => {
          expect(error.error)
            .withContext('expected error')
            .toBe(errorResponse.error);
          expect(error.status)
            .withContext('expected status')
            .toBe(errorResponse.status);

          return throwError(() => new Error('Not found'));
        })
      )
      .subscribe({
        error: (error: Error) => {
          expect(error.message).toBe('Not found');
          done();
        },
      });

    httpController
      .expectOne({
        method: 'GET',
        url: 'http://test/api/auth',
      })
      .flush(errorResponse.error, {
        status: errorResponse.status,
        statusText: errorResponse.error,
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

    service.login('test@email.local', 'some-pass').subscribe();

    httpController
      .expectOne({
        method: 'GET',
        url: 'http://test/api/auth',
      })
      .flush(expectedAuthInfo);

    expect(localStorage.getItem('id_token')).toBe(expectedAuthInfo.token);
    expect(Number(localStorage.getItem('expires_at'))).toBe(
      expectedAuthInfo.expiresAt
    );
    expect(localStorage.getItem('user')).toBe(
      JSON.stringify(expectedAuthInfo.payload)
    );
  });
});
