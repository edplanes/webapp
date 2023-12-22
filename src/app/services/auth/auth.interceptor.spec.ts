import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthInterceptor } from './auth.interceptor';

describe('AuthInterceptor', () => {
  let http: HttpClient;
  let httpController: HttpTestingController;

  beforeAll(() => {
    localStorage.clear();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    localStorage.clear();
    httpController.verify();
  });

  it('will send request where no token set', () => {
    http.get('/data').subscribe();

    const request = httpController.match('/data')[0];
    expect(request.request.headers.has('Authorization')).toBeFalsy();
  });

  it('will add authorization to request when token is set', () => {
    localStorage.setItem('id_token', 'some-token');
    http.get('/data').subscribe();

    const request = httpController.match('/data')[0];
    expect(request.request.headers.has('Authorization')).toBeTruthy();
  });
});
