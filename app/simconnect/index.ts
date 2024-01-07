import {
  Protocol,
  RecvSimObjectData,
  SimConnectConnection,
  SimConnectConstants,
  SimConnectPeriod,
  open,
} from 'node-simconnect';
import * as fs from 'fs';
import deepEqual from 'deep-equal';
import { ipcMain } from 'electron';
import { client as WebSocket, connection } from 'websocket';
import {
  FlapsData,
  FlapsRequestPayload,
  GearData,
  GearRequestPayload,
  LightsData,
  LightsRequestPayload,
  PositionRequestPayload,
  PowerData,
  PowerRequestPayload,
  RequestData,
} from './types';
import {
  addLocationDataToRequest,
  readLocationRequest,
} from './locationRequest';
import { addSystemDataToRequest, readSystemRequest } from './systemRequest';
import { addSpeedDataToRequest, readSpeedRequest } from './speedRequest';
import { addIceDataToRequest, readIceRequest } from './iceRequest';
import { addWeightDataToRequest, readWeightRequest } from './weightRequest';
import { addGearDataToRequest, readGearRequest } from './gearRequest';
import { addFlapsDataToRequest, readFlapsRequest } from './flapsRequest';
import { addLightsDataToRequest, readLightsRequest } from './lightsRequest';
import { getWindow } from '../util/window';
import { addPowerDataToRequest, readPowerRequest } from './powerRequest';

export type Options = {
  record: boolean;
  playback: boolean;
  local: boolean;
};

let frame = 0;
type handlerFn<T> = (data: RequestData<T>) => void;
let lastPostitionState: PositionRequestPayload | undefined;
let lastGearState: GearData | undefined;
let lastPowerState: PowerData | undefined;
let lastFlapsState: FlapsData | undefined;
let lastLightsState: LightsData | undefined;

export const registerSimConnect = (app: Electron.App, o: Options) => {
  if (o.playback && o.record) registerNormalOperation(app, o);
  else if (o.playback) registerPlayback(app, o);
  else registerNormalOperation(app, o);
};

function registerNormalOperation(app: Electron.App, o: Options) {
  ipcMain.handle('sim:connect', (_, fligthId: string) => {
    const data: RequestData<unknown>[] | undefined = o.record ? [] : undefined;
    const client = o.local ? undefined : new WebSocket();
    let ws: connection | undefined;
    client?.connect(`ws://localhost:3000?flightId=${fligthId}`);
    client?.on('connect', function open(conn) {
      console.log('connected');
      ws = conn;
    });
    const record = o.record;
    open('edplanes-acars', Protocol.KittyHawk).then(({ recvOpen, handle }) => {
      const window = getWindow();
      window?.webContents.send('sim:connected', recvOpen);
      ws?.on('error', (err: Error) => window?.webContents.send('error', err));

      registerPositionDataRequest(handle, dataReceived => {
        window?.webContents.send('sim:positionRequestReceived', dataReceived);
        data?.push(dataReceived);
        ws?.send(JSON.stringify(dataReceived));
      });

      registerGearDataRequest(handle, dataReceived => {
        window?.webContents.send('sim:gearRequestReceived', dataReceived);
        data?.push(dataReceived);
        ws?.send(JSON.stringify(dataReceived));
      });
      registerLightsDataRequest(handle, dataReceived => {
        window?.webContents.send('sim:lightsRequestReceived', dataReceived);
        data?.push(dataReceived);
        ws?.send(JSON.stringify(dataReceived));
      });
      registerFlapsDataRequest(handle, dataReceived => {
        window?.webContents.send('sim:flapsRequestReceived', dataReceived);
        data?.push(dataReceived);
        ws?.send(JSON.stringify(dataReceived));
      });
      registerPowerDataRequest(handle, dataReceived => {
        window?.webContents.send('sim:powerRequestReceived', dataReceived);
        data?.push(dataReceived);
        ws?.send(JSON.stringify(dataReceived));
      });

      if (record) {
        app.on('quit', () => {
          const file = fs.openSync('record.json', 'a');
          fs.writeFileSync(file, JSON.stringify(data));
        });
      }
    });
  });
}

function registerPlayback(app: Electron.App, o: Options) {
  ipcMain.handle('sim:connect', (_, fligthId: string) => {
    const timeouts: NodeJS.Timeout[] = [];
    const window = getWindow();
    const data: RequestData<unknown>[] = JSON.parse(
      fs.readFileSync('record.json', 'utf8')
    );
    const client = o.local ? undefined : new WebSocket();
    let ws: connection | undefined;
    client?.connect(`ws://localhost:3000?flightId=${fligthId}`);

    client?.on('connect', function open(conn) {
      console.log('connected');
      ws = conn;
    });

    ws?.on('error', console.error);

    const initialTimestamp = new Date(data[0].createdAt).getTime();

    data.forEach(item => {
      switch (item.type) {
        case 'postion':
        case 'position':
          timeouts.push(
            setTimeout(
              () => {
                ws?.send(JSON.stringify(item));
                window?.webContents.send('sim:positionRequestReceived', item);
              },
              new Date(item.createdAt).getTime() - initialTimestamp
            )
          );
          break;
        case 'gear':
          timeouts.push(
            setTimeout(
              () => {
                ws?.send(JSON.stringify(item));
                window?.webContents.send('sim:gearRequestReceived', item);
              },
              new Date(item.createdAt).getTime() - initialTimestamp
            )
          );
          break;
        case 'flaps':
          timeouts.push(
            setTimeout(
              () => {
                ws?.send(JSON.stringify(item));
                window?.webContents.send('sim:flapsRequestReceived', item);
              },
              new Date(item.createdAt).getTime() - initialTimestamp
            )
          );
          break;
        case 'lights':
          timeouts.push(
            setTimeout(
              () => {
                ws?.send(JSON.stringify(item));
                window?.webContents.send('sim:lightsRequestReceived', item);
              },
              new Date(item.createdAt).getTime() - initialTimestamp
            )
          );
          break;
        case 'power':
          timeouts.push(
            setTimeout(
              () => {
                ws?.send(JSON.stringify(item));
                window?.webContents.send('sim:powerRequestReceived', item);
              },
              new Date(item.createdAt).getTime() - initialTimestamp
            )
          );
          break;
      }
    });

    app.on('quit', () => timeouts.forEach(item => clearTimeout(item)));
  });
}

function registerPositionDataRequest(
  handle: SimConnectConnection,
  handler: handlerFn<PositionRequestPayload>
) {
  const REQUEST_ID = 0;
  const DEFINITION_ID = 0;

  addPositionDataToDefinition(DEFINITION_ID, handle);

  handle.requestDataOnSimObject(
    REQUEST_ID,
    DEFINITION_ID,
    SimConnectConstants.OBJECT_ID_USER,
    SimConnectPeriod.SIM_FRAME
  );

  handle.on('simObjectData', recvSimObjectData => {
    if (recvSimObjectData.requestID !== REQUEST_ID) return;

    const dataObj: RequestData<PositionRequestPayload> = {
      type: 'position',
      createdAt: new Date(),
      payload: {
        timestamp: Date.now(),
        frame,
        ...readPositionData(recvSimObjectData),
      },
    };

    if (lastPostitionState && deepEqual(lastPostitionState, dataObj.payload)) {
      return;
    }

    handler(dataObj);
    frame++;
  });
}

function registerGearDataRequest(
  handle: SimConnectConnection,
  handler: handlerFn<GearRequestPayload>
) {
  const REQUEST_ID = 1;
  const DEFINITION_ID = 1;

  addPositionDataToDefinition(DEFINITION_ID, handle);
  addGearDataToRequest(DEFINITION_ID, handle);

  handle.requestDataOnSimObject(
    REQUEST_ID,
    DEFINITION_ID,
    SimConnectConstants.OBJECT_ID_USER,
    SimConnectPeriod.SIM_FRAME
  );

  handle.on('simObjectData', recvSimObjectData => {
    if (recvSimObjectData.requestID !== REQUEST_ID) return;

    const dataObj: RequestData<GearRequestPayload> = {
      type: 'gear',
      createdAt: new Date(),
      payload: {
        timestamp: Date.now(),
        frame,
        ...readPositionData(recvSimObjectData),
        gear: readGearRequest(recvSimObjectData),
      },
    };

    if (lastGearState && deepEqual(lastGearState, dataObj.payload.gear)) {
      return;
    }

    lastGearState = dataObj.payload.gear;
    handler(dataObj);
  });
}

function registerFlapsDataRequest(
  handle: SimConnectConnection,
  handler: handlerFn<FlapsRequestPayload>
) {
  const REQUEST_ID = 2;
  const DEFINITION_ID = 2;

  addPositionDataToDefinition(DEFINITION_ID, handle);
  addFlapsDataToRequest(DEFINITION_ID, handle);

  handle.requestDataOnSimObject(
    REQUEST_ID,
    DEFINITION_ID,
    SimConnectConstants.OBJECT_ID_USER,
    SimConnectPeriod.SIM_FRAME
  );

  handle.on('simObjectData', recvSimObjectData => {
    if (recvSimObjectData.requestID !== REQUEST_ID) return;

    const dataObj: RequestData<FlapsRequestPayload> = {
      type: 'flaps',
      createdAt: new Date(),
      payload: {
        timestamp: Date.now(),
        frame,
        ...readPositionData(recvSimObjectData),
        flaps: readFlapsRequest(recvSimObjectData),
      },
    };

    if (lastFlapsState && deepEqual(lastFlapsState, dataObj.payload.flaps)) {
      return;
    }

    lastFlapsState = dataObj.payload.flaps;
    handler(dataObj);
  });
}

function registerPowerDataRequest(
  handle: SimConnectConnection,
  handler: handlerFn<PowerRequestPayload>
) {
  const REQUEST_ID = 3;
  const DEFINITION_ID = 3;

  addPositionDataToDefinition(DEFINITION_ID, handle);
  addPowerDataToRequest(DEFINITION_ID, handle);

  handle.requestDataOnSimObject(
    REQUEST_ID,
    DEFINITION_ID,
    SimConnectConstants.OBJECT_ID_USER,
    SimConnectPeriod.SIM_FRAME
  );

  handle.on('simObjectData', recvSimObjectData => {
    if (recvSimObjectData.requestID !== REQUEST_ID) return;

    const dataObj: RequestData<PowerRequestPayload> = {
      type: 'power',
      createdAt: new Date(),
      payload: {
        timestamp: Date.now(),
        frame,
        ...readPositionData(recvSimObjectData),
        power: readPowerRequest(recvSimObjectData),
      },
    };

    if (lastPowerState && deepEqual(lastPowerState, dataObj.payload.power)) {
      return;
    }

    lastPowerState = dataObj.payload.power;
    handler(dataObj);
  });
}

function registerLightsDataRequest(
  handle: SimConnectConnection,
  handler: handlerFn<LightsRequestPayload>
) {
  const REQUEST_ID = 4;
  const DEFINITION_ID = 4;

  addPositionDataToDefinition(DEFINITION_ID, handle);
  addLightsDataToRequest(DEFINITION_ID, handle);

  handle.requestDataOnSimObject(
    REQUEST_ID,
    DEFINITION_ID,
    SimConnectConstants.OBJECT_ID_USER,
    SimConnectPeriod.SIM_FRAME
  );

  handle.on('simObjectData', recvSimObjectData => {
    if (recvSimObjectData.requestID !== REQUEST_ID) return;

    const dataObj: RequestData<LightsRequestPayload> = {
      type: 'lights',
      createdAt: new Date(),
      payload: {
        timestamp: Date.now(),
        frame,
        ...readPositionData(recvSimObjectData),
        lights: readLightsRequest(recvSimObjectData),
      },
    };

    if (lastLightsState && deepEqual(lastLightsState, dataObj.payload.lights)) {
      return;
    }

    lastLightsState = dataObj.payload.lights;
    handler(dataObj);
  });
}

function addPositionDataToDefinition(
  defId: number,
  handle: SimConnectConnection
) {
  addLocationDataToRequest(defId, handle);
  addSystemDataToRequest(defId, handle);
  addSpeedDataToRequest(defId, handle);
  addIceDataToRequest(defId, handle);
  addWeightDataToRequest(defId, handle);
}

function readPositionData(recvSimObjectData: RecvSimObjectData) {
  return {
    location: readLocationRequest(recvSimObjectData),
    system: readSystemRequest(recvSimObjectData),
    speed: readSpeedRequest(recvSimObjectData),
    ice: readIceRequest(recvSimObjectData),
    weights: readWeightRequest(recvSimObjectData),
  };
}
