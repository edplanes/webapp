import {
  SimConnectConnection,
  RecvSimObjectData,
  SimConnectDataType,
} from 'node-simconnect';
import { FlapsData } from './types';

export const addFlapsDataToRequest = (
  defID: number,
  handle: SimConnectConnection
) => {
  handle.addToDataDefinition(
    defID,
    'FLAP SPEED EXCEEDED',
    'bool',
    SimConnectDataType.INT32
  );
  handle.addToDataDefinition(
    defID,
    'FLAPS HANDLE PERCENT',
    'percent',
    SimConnectDataType.FLOAT64
  );
};

export const readFlapsRequest = (
  simObjectData: RecvSimObjectData
): FlapsData => {
  const data = simObjectData.data;
  return {
    overspeed: !!data.readInt32(),
    flapsPosition: data.readFloat64(),
  };
};
