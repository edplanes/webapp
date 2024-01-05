import {
  RecvSimObjectData,
  SimConnectConnection,
  SimConnectDataType,
} from 'node-simconnect';
import { SpeedData } from './types';

export const addSpeedDataToRequest = (
  defID: number,
  handle: SimConnectConnection
) => {
  handle.addToDataDefinition(
    defID,
    'AIRSPEED INDICATED',
    'knots',
    SimConnectDataType.FLOAT64
  );
  handle.addToDataDefinition(
    defID,
    'AIRSPEED TRUE',
    'knots',
    SimConnectDataType.FLOAT64
  );
  handle.addToDataDefinition(
    defID,
    'AIRSPEED MACH',
    'mach',
    SimConnectDataType.FLOAT64
  );
  handle.addToDataDefinition(
    defID,
    'GROUND VELOCITY',
    'knots',
    SimConnectDataType.FLOAT64
  );
  handle.addToDataDefinition(
    defID,
    'VERTICAL SPEED',
    'feet/minute',
    SimConnectDataType.FLOAT64
  );
  handle.addToDataDefinition(
    defID,
    'PLANE TOUCHDOWN NORMAL VELOCITY',
    'feet/minute',
    SimConnectDataType.FLOAT64
  );
  handle.addToDataDefinition(
    defID,
    'VELOCITY BODY X',
    'feet/minute',
    SimConnectDataType.FLOAT64
  );
  handle.addToDataDefinition(
    defID,
    'VELOCITY BODY Y',
    'feet/minute',
    SimConnectDataType.FLOAT64
  );
  handle.addToDataDefinition(
    defID,
    'VELOCITY BODY Z',
    'feet/minute',
    SimConnectDataType.FLOAT64
  );
  handle.addToDataDefinition(
    defID,
    'OVERSPEED WARNING',
    'bool',
    SimConnectDataType.INT32
  );
};

export const readSpeedRequest = (
  simObjectData: RecvSimObjectData
): SpeedData => {
  const data = simObjectData.data;
  return {
    indicatedAirspeed: data.readFloat64(),
    trueAirspeed: data.readFloat64(),
    mach: data.readFloat64(),
    groundSpeed: data.readFloat64(),
    verticalSpeed: data.readFloat64(),
    touchDownRate: data.readFloat64(),
    velocityX: data.readFloat64(),
    velocityY: data.readFloat64(),
    velocityZ: data.readFloat64(),
    overspeed: !!data.readInt32(),
  };
};
