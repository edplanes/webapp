import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { IAuthInfo } from '../../models/auth.model';
import { Observable, of } from 'rxjs';
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
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
    const configService = new MockedConfigService(httpClientSpy);
    service = new AuthService(httpClientSpy, configService);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: ConfigService,
          useValue: configService,
        },
      ],
    });
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
    httpClientSpy.post.and.returnValue(of(expectedAuthInfo));

    service.login('test@email.local', 'some-pass').subscribe({
      next: authInfo => {
        expect(authInfo)
          .withContext('expected authentication info')
          .toBe(expectedAuthInfo);
        done();
      },
      error: done.fail,
    });
    expect(httpClientSpy.post.calls.count())
      .withContext('single call expected')
      .toBe(1);
    expect(httpClientSpy.post.calls.first().args[2]?.headers)
      .withContext('contains authorization header')
      .toEqual({
        Authorization: 'Basic dGVzdEBlbWFpbC5sb2NhbDpzb21lLXBhc3M=',
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
    httpClientSpy.post.and.returnValue(of(expectedAuthInfo));

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
