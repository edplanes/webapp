/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { LogService } from './log.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('Service: Log', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LogService],
    });
  });

  it('should ...', inject([LogService], (service: LogService) => {
    expect(service).toBeTruthy();
  }));
});
