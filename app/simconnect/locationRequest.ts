import {
  RecvSimObjectData,
  SimConnectConnection,
  SimConnectDataType,
} from 'node-simconnect';
import { LocationRequestData } from './types';

export const addLocationDataToRequest = (
  defID: number,
  handle: SimConnectConnection
) => {
  handle.addToDataDefinition(
    defID,
    'Plane Latitude',
    'degrees',
    SimConnectDataType.FLOAT64
  );
  handle.addToDataDefinition(
    defID,
    'Plane Longitude',
    'degrees',
    SimConnectDataType.FLOAT64
  );
  handle.addToDataDefinition(
    defID,
    'Indicated Altitude',
    'feet',
    SimConnectDataType.FLOAT64
  );
  handle.addToDataDefinition(
    defID,
    'PLANE ALTITUDE',
    'feet',
    SimConnectDataType.FLOAT64
  );
  handle.addToDataDefinition(
    defID,
    'PLANE ALT ABOVE GROUND MINUS CG',
    'feet',
    SimConnectDataType.FLOAT64
  );
  handle.addToDataDefinition(
    defID,
    'PLANE HEADING DEGREES TRUE',
    'degrees',
    SimConnectDataType.FLOAT64
  );
  handle.addToDataDefinition(
    defID,
    'PLANE HEADING DEGREES MAGNETIC',
    'degrees',
    SimConnectDataType.FLOAT64
  );
  handle.addToDataDefinition(
    defID,
    'MAGVAR',
    'degrees',
    SimConnectDataType.FLOAT64
  );
  handle.addToDataDefinition(
    defID,
    'GPS GROUND TRUE TRACK',
    'degrees',
    SimConnectDataType.FLOAT64
  );
  handle.addToDataDefinition(
    defID,
    'PLANE BANK DEGREES',
    'degrees',
    SimConnectDataType.FLOAT64
  );
  handle.addToDataDefinition(
    defID,
    'PLANE PITCH DEGREES',
    'degrees',
    SimConnectDataType.FLOAT64
  );
  handle.addToDataDefinition(
    defID,
    'G FORCE',
    'gForce',
    SimConnectDataType.FLOAT64
  );
  handle.addToDataDefinition(
    defID,
    'SIM ON GROUND',
    'bool',
    SimConnectDataType.INT64
  );
  handle.addToDataDefinition(
    defID,
    'ON ANY RUNWAY',
    'bool',
    SimConnectDataType.INT64
  );
  handle.addToDataDefinition(
    defID,
    'ACCELERATION BODY X',
    'feet',
    SimConnectDataType.FLOAT64
  );
  handle.addToDataDefinition(
    defID,
    'ACCELERATION BODY Y',
    'feet',
    SimConnectDataType.FLOAT64
  );
  handle.addToDataDefinition(
    defID,
    'ACCELERATION BODY Z',
    'feet',
    SimConnectDataType.FLOAT64
  );
  handle.addToDataDefinition(
    defID,
    'IS SLEW ACTIVE',
    'bool',
    SimConnectDataType.INT32
  );
  handle.addToDataDefinition(
    defID,
    'STALL ALPHA',
    'degrees',
    SimConnectDataType.FLOAT64
  );
  handle.addToDataDefinition(
    defID,
    'INCIDENCE ALPHA',
    'degrees',
    SimConnectDataType.FLOAT64
  );
  handle.addToDataDefinition(
    defID,
    'ZERO LIFT ALPHA',
    'degrees',
    SimConnectDataType.FLOAT64
  );
};

export const readLocationRequest = (
  simObjectData: RecvSimObjectData
): LocationRequestData => {
  const data = simObjectData.data;
  return {
    latitude: data.readFloat64(),
    longitude: data.readFloat64(),
    indicatedAltitude: data.readFloat64(),
    altitude: data.readFloat64(),
    altitudeAboveGround: data.readFloat64(),
    heading: data.readFloat64(),
    magneticHeading: data.readFloat64(),
    magneticVariation: data.readFloat64(),
    track: data.readFloat64(),
    bank: data.readFloat64(),
    pitch: data.readFloat64(),
    gforce: data.readFloat64(),
    onGround: !!data.readInt64(),
    onRunway: !!data.readInt64(),
    accelarationX: data.readFloat64(),
    accelarationY: data.readFloat64(),
    accelarationZ: data.readFloat64(),
    slew: !!data.readInt32(),
    stallAlpha: data.readFloat64(),
    angleOfAttack: data.readFloat64(),
    zeroLiftAoA: data.readFloat64(),
  };
};
