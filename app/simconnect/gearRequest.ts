import {
  RecvSimObjectData,
  SimConnectConnection,
  SimConnectDataType,
} from 'node-simconnect';
import { GearData } from './types';

export const addGearDataToRequest = (
  defID: number,
  handle: SimConnectConnection
) => {
  handle.addToDataDefinition(
    defID,
    'GEAR SPEED EXCEEDED',
    'bool',
    SimConnectDataType.INT32
  );
  handle.addToDataDefinition(
    defID,
    'GEAR DAMAGE BY SPEED',
    'bool',
    SimConnectDataType.INT32
  );
  handle.addToDataDefinition(
    defID,
    'GEAR TOTAL PCT EXTENDED',
    'percent',
    SimConnectDataType.FLOAT64
  );
  handle.addToDataDefinition(
    defID,
    'BRAKE PARKING POSITION',
    'bool',
    SimConnectDataType.INT32
  );
};

export const readGearRequest = (simObjectData: RecvSimObjectData): GearData => {
  const data = simObjectData.data;
  return {
    speedExceeded: !!data.readInt32(),
    damaged: !!data.readInt32(),
    gearExtention: data.readFloat64(),
    parkingBrake: !!data.readInt32(),
  };
};
