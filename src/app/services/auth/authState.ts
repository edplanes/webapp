import { of } from 'rxjs';
import { IAuthInfo } from '../../models/auth.model';

export class AuthState {
  private static instance: AuthState;

  private authState: IAuthInfo | undefined = undefined;

  private constructor() {}

  static getInstance() {
    if (!AuthState.instance) {
      AuthState.instance = new AuthState();
    }
    return AuthState.instance;
  }

  getValue() {
    return this.authState;
  }

  next(authState: IAuthInfo | undefined) {
    this.authState = authState;
  }

  asObservable() {
    return of(this.authState);
  }
}
