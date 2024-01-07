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
    'number', // MSFS is weird, I don't know why but it's working as expected
    SimConnectDataType.STRING256
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
    configTitle: data.readString256(),
    filename: aircraftConfig,
    engines: data.readInt32(),
  };
};
