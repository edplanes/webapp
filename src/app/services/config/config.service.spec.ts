import { TestBed } from '@angular/core/testing';

import { ConfigService } from './config.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { first, last } from 'rxjs';

describe('ConfigService', () => {
  let service: ConfigService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ConfigService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load config', (done: DoneFn) => {
    const expectedConfig = {
      apiServer: 'http://localhost:8080/api',
    };
    service.load().subscribe(config => {
      expect(config.apiServer).toBe(expectedConfig.apiServer);
      done();
    });

    httpController
      .expectOne({
        method: 'GET',
        url: `assets/config/config.${environment.name}.json`,
      })
      .flush(expectedConfig);
  });

  it('should update state', (done: DoneFn) => {
    service.load().subscribe();

    service.state$.pipe(first()).subscribe(state => {
      expect(state.isLoaded).toBeFalsy();
      done();
    });

    service.state$.pipe(last()).subscribe(state => {
      expect(state.isLoaded).toBeTruthy();
      done();
    });

    httpController
      .expectOne({
        method: 'GET',
        url: `assets/config/config.${environment.name}.json`,
      })
      .flush({
        apiServer: 'http://localhost:8080/api',
      });
  });
});
