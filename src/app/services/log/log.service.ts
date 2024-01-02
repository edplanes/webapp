import { Injectable, inject } from '@angular/core';
import { LogConsole, LogPublisher } from './log-publishers';
import { ConfigService } from '../config/config.service';

export enum LogLevel {
  All,
  Debug,
  Info,
  Warn,
  Error,
  Fatal,
  Off,
}

@Injectable({
  providedIn: 'root',
})
export class LogService {
  level: LogLevel = LogLevel.All;
  logDate: boolean = true;
  publishers: LogPublisher[] = [];
  visitorId = localStorage.getItem('visitorId') || this.generateVisitorId();

  constructor(configService?: ConfigService) {
    if (!configService) configService = inject(ConfigService);

    configService.state$.subscribe(state => {
      if (!state.isLoaded || !state.data?.logger) return;

      const config = state.data;

      this.level = config.logger.level;
      const publishers = config.logger.publishers
        .filter(publisher => publisher.isActive)
        .map(publisher => {
          let publish: LogPublisher;
          switch (publisher.name.toLowerCase()) {
            default:
              publish = new LogConsole();
              break;
          }

          publish.location = publisher.location;

          return publish;
        });

      this.publishers = publishers;
    });

    if (this.publishers.length == 0) {
      this.publishers.push(new LogConsole());
    }
  }

  debug(msg: string, ...params: unknown[]) {
    this.writeLog(msg, LogLevel.Debug, params);
  }

  info(msg: string, ...params: unknown[]) {
    this.writeLog(msg, LogLevel.Info, params);
  }

  warn(msg: string, ...params: unknown[]) {
    this.writeLog(msg, LogLevel.Warn, params);
  }

  error(msg: string, ...params: unknown[]) {
    this.writeLog(msg, LogLevel.Error, params);
  }

  fatal(msg: string, ...params: unknown[]) {
    this.writeLog(msg, LogLevel.Fatal, params);
  }

  log(msg: string, ...params: unknown[]) {
    this.writeLog(msg, LogLevel.All, params);
  }

  private writeLog(msg: string, level: LogLevel, params: unknown[]) {
    if (!this.shouldLog(level)) return;

    const entry = new LogEntry();
    entry.message = msg;
    entry.level = level;
    entry.extraInfo = params;
    entry.visitorId = this.visitorId;
    entry.logWithDate = this.logDate;

    this.publishers.forEach(logger => logger.log(entry).subscribe(() => {}));
  }

  private generateVisitorId(): string {
    const id = crypto.randomUUID();
    localStorage.setItem('visitorId', id);
    return id;
  }

  private shouldLog(level: LogLevel) {
    return (
      (level >= this.level && level !== LogLevel.Off) ||
      this.level == LogLevel.All
    );
  }
}

export class LogEntry {
  entryDate: Date = new Date();
  message: string = '';
  level: LogLevel = LogLevel.Debug;
  visitorId: string = '';
  extraInfo: unknown[] = [];
  logWithDate: boolean = true;

  public toString(): string {
    let ret: string = '';

    if (this.logWithDate) ret = `${this.entryDate} - `;

    ret += `Type: ${LogLevel[this.level]} - Message: ${this.message}`;

    if (this.extraInfo.length)
      ret += ` - Extra Info: ${this.formatParams(this.extraInfo)}`;

    return ret;
  }

  private formatParams(params: unknown[]): string {
    let ret: string = params.join(',');

    if (params.some(p => typeof p == 'object')) {
      ret = '';

      params.forEach(item => (ret += JSON.stringify(item)));
    }

    return ret;
  }
}
