import WebSocket from 'ws';

export class WebSocketClient {
  private _ws: WebSocket | undefined;
  private _datatoSend: unknown[] = [];

  constructor(
    private baseUrl: string,
    public token?: string
  ) {}

  connect(...params: { [key: string]: string }[]) {
    this._ws = this.createWebsocket(
      `${this.baseUrl}${this.getQueryParams(params)}`
    );

    if (this._datatoSend.length > 0)
      this._datatoSend.forEach(value => this._ws?.send(JSON.stringify(value)));
  }

  close() {
    this._ws?.close();
  }

  async send(data: unknown) {
    if (!this._ws) {
      this._datatoSend.push(data);
    } else {
      this._ws.send(JSON.stringify(data));
    }
  }

  private getQueryParams(params: { [key: string]: string }[]) {
    const queryParams: string[] = [];
    params.forEach(({ key, value }) => {
      queryParams.push(`${key}=${value}`);
    });

    return queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
  }

  private setAuthorizationToken() {
    if (this.token) {
      return {
        headers: {
          authorization: `Bearer ${this.token}`,
        },
      };
    }

    return {};
  }

  private createWebsocket(url: string) {
    let ws: WebSocket | undefined;

    const client = new WebSocket(url, this.setAuthorizationToken());
    client.on('open', () => {
      ws = client;
    });
    client.on('error', err => {
      throw err;
    });

    const timeout = setTimeout(() => {
      throw new Error('connection timeout');
    }, 600000);
    while (!ws) {
      console.log('Waiting for connection with reporting service...');
    }
    clearTimeout(timeout);

    return ws;
  }
}
