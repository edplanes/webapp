import {
  RecvSimObjectData,
  SimConnectConnection,
  SimConnectDataType,
} from 'node-simconnect';
import { WeightsData } from './types';

export const addWeightDataToRequest = (
  defID: number,
  handle: SimConnectConnection
) => {
  handle.addToDataDefinition(
    defID,
    'FUEL TOTAL QUANTITY WEIGHT',
    'kilograms',
    SimConnectDataType.FLOAT64
  );
  handle.addToDataDefinition(
    defID,
    'TOTAL WEIGHT',
    'kilograms',
    SimConnectDataType.FLOAT64
  );
};

export const readWeightRequest = (
  simObjectData: RecvSimObjectData
): WeightsData => {
  const data = simObjectData.data;
  return {
    fuel: data.readFloat64(),
    total: data.readFloat64(),
  };
};
