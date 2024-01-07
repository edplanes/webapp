export class LoggerState {
  private static instance: LoggerState;

  private _flightId: string | undefined = undefined;
  private _inProgress: boolean = false;

  get flightId() {
    return this._flightId;
  }

  get isInProgress() {
    return this._inProgress;
  }

  private constructor() {}

  static getInstance() {
    if (!LoggerState.instance) {
      LoggerState.instance = new LoggerState();
    }

    return LoggerState.instance;
  }

  next(flightId: string, isInProgress: boolean) {
    this._flightId = flightId;
    this._inProgress = isInProgress;
  }

  updateState(isInProgress: boolean) {
    this._inProgress = isInProgress;
  }

  close() {
    this._flightId = undefined;
    this._inProgress = false;
  }
}
