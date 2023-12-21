import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Config } from './config.model';

export interface ConfigState {
  isLoaded: boolean;
  data: Config | null;
}

const initialState: ConfigState = {
  isLoaded: false,
  data: null,
};

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private readonly state = new BehaviorSubject<ConfigState>(initialState);

  public readonly state$ = this.state.asObservable();

  constructor(private http: HttpClient) {}

  public load(): Observable<Config> {
    const jsonFile = `assets/config/config.${environment.name}.json`;
    return this.http.get<Config>(jsonFile).pipe(
      tap(config => {
        this.state.next({ isLoaded: true, data: config });
      })
    );
  }
}
