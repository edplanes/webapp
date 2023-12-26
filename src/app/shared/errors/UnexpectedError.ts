export class UnexpectedError extends Error {
  private _addtionalInfo: unknown[];
  get addtionatlInfo() {
    return this._addtionalInfo;
  }

  constructor(error: string, ...additionalInfo: unknown[]) {
    super(`Unexpected error occured: ${error}`);
    this._addtionalInfo = additionalInfo;
  }
}
