import {
  RecvSimObjectData,
  SimConnectConnection,
  SimConnectDataType,
} from 'node-simconnect';
import { PowerData } from './types';

export const addPowerDataToRequest = (
  defID: number,
  handle: SimConnectConnection
) => {
  handle.addToDataDefinition(
    defID,
    'EXTERNAL POWER ON',
    'bool',
    SimConnectDataType.INT32
  );
  handle.addToDataDefinition(
    defID,
    'APU SWITCH',
    'bool',
    SimConnectDataType.INT32
  );
  handle.addToDataDefinition(
    defID,
    'ENG COMBUSTION:1',
    'bool',
    SimConnectDataType.INT32
  );
  handle.addToDataDefinition(
    defID,
    'ENG COMBUSTION:2',
    'bool',
    SimConnectDataType.INT32
  );
  handle.addToDataDefinition(
    defID,
    'ENG COMBUSTION:3',
    'bool',
    SimConnectDataType.INT32
  );
  handle.addToDataDefinition(
    defID,
    'ENG COMBUSTION:4',
    'bool',
    SimConnectDataType.INT32
  );
};

export const readPowerRequest = (
  simObjectData: RecvSimObjectData
): PowerData => {
  const data = simObjectData.data;
  return {
    external: !!data.readInt32(),
    apu: !!data.readInt32(),
    engines: [
      !!data.readInt32(),
      !!data.readInt32(),
      !!data.readInt32(),
      !!data.readInt32(),
    ],
  };
};
