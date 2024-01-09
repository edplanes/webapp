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
import {
  AircraftData,
  AircraftRequestPayload,
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
import {
  addAircraftDataToRequest,
  readAircraftRequest,
} from './aircraftRequest';
import EventEmitter from 'events';
import { logger } from '../util/log';

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
let lastAircraftState: AircraftData | undefined;

export const registerSimConnect = (
  app: Electron.App,
  eventer: EventEmitter,
  playback: boolean
) => {
  if (playback) registerPlayback(app, eventer);
  else registerNormalOperation(app, eventer);
};

function registerNormalOperation(app: Electron.App, eventer: EventEmitter) {
  ipcMain.handle('sim:connect', (_, fligthId: string, token: string) => {
    open('edplanes-acars', Protocol.KittyHawk).then(
      ({ recvOpen, handle }): void => {
        eventer.emit('flight:started', fligthId, token, recvOpen);

        const handler = (dataReceived: RequestData<unknown>) => {
          eventer.emit('sim:dataReceived', dataReceived);
        };

        registerPositionDataRequest(handle, handler);
        registerGearDataRequest(handle, handler);
        registerLightsDataRequest(handle, handler);
        registerFlapsDataRequest(handle, handler);
        registerPowerDataRequest(handle, handler);
        registerAircraftDataRequest(handle, handler);

        ipcMain.handle('flight:close', () => {
          handle.close();
          eventer.emit('flight:closed');
        });
      }
    );
  });
}

function registerPlayback(app: Electron.App, eventer: EventEmitter) {
  const timeouts: NodeJS.Timeout[] = [];
  const window = getWindow();
  ipcMain.handle('flight:close', () => {
    timeouts.forEach(timeout => {
      clearTimeout(timeout);
    });
    window?.webContents.send('flight:closed');
    eventer.emit('flight:closed');
  });
  ipcMain.handle('sim:connect', (_, fligthId: string, token: string) => {
    logger.debug('Starting flight...', fligthId);
    const data: RequestData<unknown>[] = JSON.parse(
      fs.readFileSync('record.json', 'utf8')
    );
    eventer.emit('flight:started', fligthId, token, {
      applicationBuildMajor: 0,
      applicationBuildMinor: 0,
      applicationVersionMajor: 0,
      applicationVersionMinor: 0,
    });

    const initialTimestamp = new Date(data[0].createdAt).getTime();

    data.forEach(item => {
      timeouts.push(
        setTimeout(
          () => {
            eventer.emit('sim:dataReceived', item);
          },
          new Date(item.createdAt).getTime() - initialTimestamp
        )
      );
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

function registerAircraftDataRequest(
  handle: SimConnectConnection,
  handler: handlerFn<AircraftRequestPayload>
) {
  const REQUEST_ID = 5;
  const DEFINITION_ID = 5;

  addPositionDataToDefinition(DEFINITION_ID, handle);
  addAircraftDataToRequest(DEFINITION_ID, handle);

  handle.requestDataOnSimObject(
    REQUEST_ID,
    DEFINITION_ID,
    SimConnectConstants.OBJECT_ID_USER,
    SimConnectPeriod.SIM_FRAME
  );

  handle.on('simObjectData', recvSimObjectData => {
    if (recvSimObjectData.requestID !== REQUEST_ID) return;

    const dataObj: RequestData<AircraftRequestPayload> = {
      type: 'aircraft',
      createdAt: new Date(),
      payload: {
        timestamp: Date.now(),
        frame,
        ...readPositionData(recvSimObjectData),
        aircraft: readAircraftRequest(recvSimObjectData),
      },
    };

    if (
      lastAircraftState &&
      deepEqual(lastAircraftState, dataObj.payload.aircraft)
    ) {
      return;
    }

    lastAircraftState = dataObj.payload.aircraft;
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
