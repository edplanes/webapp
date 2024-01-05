import {
  SimConnectConnection,
  SimConnectDataType,
  RecvSimObjectData,
} from 'node-simconnect';
import { AircraftData } from './types';
import { AIRCRAFT_LOADED_ID } from './events';

let aircraftConfig = '';

export const addAircraftDataToRequest = (
  defID: number,
  handle: SimConnectConnection
) => {
  handle.subscribeToSystemEvent(AIRCRAFT_LOADED_ID, 'AircraftLoaded');

  handle.on('eventFilename', data => {
    aircraftConfig = data.fileName;
  });

  handle.addToDataDefinition(
    defID,
    'TITLE',
    'string',
    SimConnectDataType.STRINGV
  );
  handle.addToDataDefinition(
    defID,
    'NUMBER OF ENGINES',
    'number',
    SimConnectDataType.INT32
  );
};

export const readAircraftRequest = (
  simObjectData: RecvSimObjectData
): AircraftData => {
  const data = simObjectData.data;
  return {
    configTitle: data.readStringV(),
    filename: aircraftConfig,
    engines: data.readInt32(),
  };
};
