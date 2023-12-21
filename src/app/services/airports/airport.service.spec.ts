/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { AirportService } from './airport.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('Service: Airport', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AirportService],
    });
  });

  it('should ...', inject([AirportService], (service: AirportService) => {
    expect(service).toBeTruthy();
  }));
});
