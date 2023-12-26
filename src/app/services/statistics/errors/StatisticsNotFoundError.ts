export class StatisticsNotFoundError extends Error {
  get userId() {
    return this._userId;
  }

  constructor(private _userId: string) {
    super(`Statistics for ${_userId} user not found`);
  }
}
