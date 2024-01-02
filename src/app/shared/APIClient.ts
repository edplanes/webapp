import { ConfigService } from '../services/config/config.service';
import { first, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export abstract class APIClient {
  protected apiServerBaseUrl: string = '';

  constructor(
    protected http: HttpClient,
    configService: ConfigService
  ) {
    configService.state$
      .pipe(
        first(config => config.isLoaded),
        map(({ data }) => data)
      )
      .subscribe(config => (this.apiServerBaseUrl = config?.apiServer || ''));
  }
}
