import {
  RecvSimObjectData,
  SimConnectConnection,
  SimConnectDataType,
} from 'node-simconnect';
import { SystemData } from './types';
import { FRAME_RATE_ID, PAUSE_ID } from './events';

let fps = 0;
let simRate = 1;
let paused = false;

export const addSystemDataToRequest = (
  defID: number,
  handle: SimConnectConnection
) => {
  handle.subscribeToSystemEvent(FRAME_RATE_ID, 'Frame');
  handle.subscribeToSystemEvent(PAUSE_ID, 'Pause');

  handle.on('eventFrame', data => {
    if (data.clientEventId === FRAME_RATE_ID) {
      fps = data.frameRate;
      simRate = data.simSpeed;
    }
  });

  handle.on('event', data => {
    if (data.clientEventId === PAUSE_ID) {
      paused = !!data.data;
    }
  });

  handle.addToDataDefinition(
    defID,
    'UNLIMITED FUEL',
    'bool',
    SimConnectDataType.INT32
  );
};

export const readSystemRequest = (
  simObjectData: RecvSimObjectData
): SystemData => {
  const data = simObjectData.data;
  return {
    framesPerSecond: fps,
    simRate: simRate,
    isPaused: paused,
    unlimitedFuel: !!data.readInt32(),
  };
};
