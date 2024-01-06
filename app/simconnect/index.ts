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
import {
  FlapsData,
  FlapsRequestPayload,
  GearData,
  GearRequestPayload,
  LightsData,
  LightsRequestPayload,
  PositionRequestPayload,
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
import { ipcMain } from 'electron';

let frame = 0;
type handlerFn<T> = (data: RequestData<T>) => void;
let lastGearState: GearData | undefined;
//let lastAircraftState: AircraftData | undefined;
let lastFlapsState: FlapsData | undefined;
let lastLightsState: LightsData | undefined;

export const registerSimConnect = (
  app: Electron.App,
  record: boolean,
  playback: boolean
) => {
  if (playback && record) registerNormalOperation(app, true);
  else if (playback) registerPlayback();
  else registerNormalOperation(app, record);
};

function registerNormalOperation(app: Electron.App, record: boolean) {
  const data: RequestData<unknown>[] = [];
  ipcMain.handle('sim:connect', () => {
    const file = fs.openSync('record.json', 'a');
    open('edplanes-acars-record', Protocol.KittyHawk).then(
      ({ recvOpen, handle }) => {
        const window = getWindow();
        window?.webContents.send('sim:connected', recvOpen);

        registerPositionDataRequest(handle, dataReceived => {
          window?.webContents.send('sim:positionRequestReceived', dataReceived);
          record && data.push(dataReceived);
        });

        registerGearDataRequest(handle, dataReceived => {
          window?.webContents.send('sim:gearRequestReceived', dataReceived);
          record && data.push(dataReceived);
        });
        registerLightsDataRequest(handle, dataReceived => {
          window?.webContents.send('sim:lightsRequestReceived', dataReceived);
          record && data.push(dataReceived);
        });
        registerFlapsDataRequest(handle, dataReceived => {
          window?.webContents.send('sim:flapsRequestReceived', dataReceived);
          record && data.push(dataReceived);
        });

        if (record) {
          app.on('quit', () => {
            fs.writeFileSync(file, JSON.stringify(data));
          });
        }
      }
    );
  });
}

function registerPlayback() {}

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
      type: 'postion',
      createdAt: new Date(),
      payload: {
        timestamp: Date.now(),
        frame,
        ...readPositionData(recvSimObjectData),
      },
    };

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
      type: 'postion',
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
      type: 'postion',
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

// function registerAircraftDataRequest(
//   handle: SimConnectConnection,
//   handler: handlerFn<AircraftRequestPayload>
// ) {
//   const REQUEST_ID = 3;
//   const DEFINITION_ID = 3;

//   addPositionDataToDefinition(DEFINITION_ID, handle);
//   addAircraftDataToRequest(DEFINITION_ID, handle);

//   handle.requestDataOnSimObject(
//     REQUEST_ID,
//     DEFINITION_ID,
//     SimConnectConstants.OBJECT_ID_USER,
//     SimConnectPeriod.SIM_FRAME
//   );

//   handle.on('simObjectData', recvSimObjectData => {
//     if (recvSimObjectData.requestID !== REQUEST_ID) return;

//     const dataObj: RequestData<AircraftRequestPayload> = {
//       type: 'postion',
//       createdAt: new Date(),
//       payload: {
//         timestamp: Date.now(),
//         frame,
//         ...readPositionData(recvSimObjectData),
//         aircraft: readAircraftRequest(recvSimObjectData),
//       },
//     };

//     if (
//       lastAircraftState &&
//       deepEqual(lastAircraftState, dataObj.payload.aircraft)
//     ) {
//       return;
//     }

//     lastAircraftState = dataObj.payload.aircraft;
//     handler(dataObj);
//   });
// }

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
      type: 'postion',
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
