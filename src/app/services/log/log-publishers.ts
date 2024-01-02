import { Observable, of } from 'rxjs';
import { LogEntry, LogLevel } from './log.service';

export abstract class LogPublisher {
  location!: string;
  abstract log(record: LogEntry): Observable<boolean>;
  abstract clear(): Observable<boolean>;
}

export class LogConsole extends LogPublisher {
  override log(record: LogEntry): Observable<boolean> {
    switch (record.level) {
      case LogLevel.Warn:
        console.warn(this.formatMessage(record));
        break;
      case LogLevel.Error:
      case LogLevel.Fatal:
        console.error(this.formatMessage(record));
        break;
      default:
        console.log(this.formatMessage(record));
        break;
    }
    return of(true);
  }

  override clear(): Observable<boolean> {
    console.clear();
    return of(true);
  }

  private formatMessage(record: LogEntry): string {
    let message = '';
    if (record.logWithDate) {
      message += record.entryDate.toDateString();
    }

    message += ` [${LogLevel[record.level].toUpperCase()}] [${
      record.visitorId
    }] ${record.message}`;

    let params = record.extraInfo;
    if (params.length) {
      if (params.some(param => typeof param == 'object')) {
        params = params.map(param => JSON.stringify(param));
      }

      message += ` ${params.join(',')}`;
    }

    return message;
  }
}
