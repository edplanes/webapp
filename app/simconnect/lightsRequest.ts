import {
  RecvSimObjectData,
  SimConnectConnection,
  SimConnectDataType,
} from 'node-simconnect';
import { LightsData } from './types';

export const addLightsDataToRequest = (
  defID: number,
  handle: SimConnectConnection
) => {
  handle.addToDataDefinition(
    defID,
    'LIGHT BEACON',
    'bool',
    SimConnectDataType.INT32
  );
  handle.addToDataDefinition(
    defID,
    'LIGHT LANDING',
    'bool',
    SimConnectDataType.INT32
  );
  handle.addToDataDefinition(
    defID,
    'LIGHT NAV',
    'bool',
    SimConnectDataType.INT32
  );
  handle.addToDataDefinition(
    defID,
    'LIGHT STROBE',
    'bool',
    SimConnectDataType.INT32
  );
  handle.addToDataDefinition(
    defID,
    'LIGHT TAXI',
    'bool',
    SimConnectDataType.INT32
  );
};

export const readLightsRequest = (
  simObjectData: RecvSimObjectData
): LightsData => {
  const data = simObjectData.data;
  return {
    beacon: !!data.readInt32(),
    landing: !!data.readInt32(),
    nav: !!data.readInt32(),
    strobe: !!data.readInt32(),
    taxi: !!data.readInt32(),
  };
};
