export class UserNotFound extends Error {
  constructor() {
    super(`User not found`);
    super.name = 'UserNotFound';
  }
}
