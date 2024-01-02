import { AuthState } from './authState';

describe('Auth State', () => {
  it('should be singleton', () => {
    const authState1 = new AuthState();
    const authState2 = new AuthState();

    expect(authState1.getValue()).toBe(authState2.getValue());
  });
});
