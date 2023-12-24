/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { LogLevel, LogService } from './log.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LogConsole } from './log-publishers';

describe('Service: Log', () => {
  let service: LogService;
  let consoleLogSpy: jasmine.Spy;

  beforeEach(() => {
    consoleLogSpy = spyOn(LogConsole.prototype, 'log').and.callThrough();

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(LogService);
  });

  it('should call publisher', () => {
    service.log('test');

    expect(consoleLogSpy).toHaveBeenCalled();
  });

  it('should call with valid log level', () => {
    service.debug('');

    expect(consoleLogSpy.calls.mostRecent().args[0].level).toBe(LogLevel.Debug);

    service.info('');

    expect(consoleLogSpy.calls.mostRecent().args[0].level).toBe(LogLevel.Info);

    service.warn('');

    expect(consoleLogSpy.calls.mostRecent().args[0].level).toBe(LogLevel.Warn);

    service.error('');

    expect(consoleLogSpy.calls.mostRecent().args[0].level).toBe(LogLevel.Error);

    service.fatal('');

    expect(consoleLogSpy.calls.mostRecent().args[0].level).toBe(LogLevel.Fatal);

    service.log('');

    expect(consoleLogSpy.calls.mostRecent().args[0].level).toBe(LogLevel.All);
  });
});
