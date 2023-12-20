/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AirportService } from './airport.service';

describe('Service: Airport', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AirportService]
    });
  });

  it('should ...', inject([AirportService], (service: AirportService) => {
    expect(service).toBeTruthy();
  }));
});
