import { inject } from '@angular/core';
import { ConfigService } from '../services/config/config.service';
import { first, map } from 'rxjs';

export abstract class APIClient {
  protected apiServerBaseUrl: string = '';

  constructor() {
    inject(ConfigService)
      .state$.pipe(
        first(config => config.isLoaded),
        map(({ data }) => data)
      )
      .subscribe(config => (this.apiServerBaseUrl = config?.apiServer || ''));
  }
}
