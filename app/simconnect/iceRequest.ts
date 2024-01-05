import {
  RecvSimObjectData,
  SimConnectConnection,
  SimConnectDataType,
} from 'node-simconnect';
import { IceData } from './types';

export const addIceDataToRequest = (
  defID: number,
  handle: SimConnectConnection
) => {
  handle.addToDataDefinition(
    defID,
    'PITOT ICE PCT',
    'percent',
    SimConnectDataType.FLOAT64
  );
  handle.addToDataDefinition(
    defID,
    'STRUCTURAL ICE PCT',
    'percent',
    SimConnectDataType.FLOAT64
  );
  handle.addToDataDefinition(
    defID,
    'PANEL ANTI ICE SWITCH',
    'bool',
    SimConnectDataType.INT32
  );
  handle.addToDataDefinition(
    defID,
    'PITOT HEAT',
    'bool',
    SimConnectDataType.INT32
  );
  handle.addToDataDefinition(
    defID,
    'STRUCTURAL DEICE SWITCH',
    'bool',
    SimConnectDataType.INT32
  );
  handle.addToDataDefinition(
    defID,
    'WINDSHIELD DEICE SWITCH',
    'bool',
    SimConnectDataType.INT32
  );
  handle.addToDataDefinition(
    defID,
    'ENG ANTI ICE:1',
    'bool',
    SimConnectDataType.INT32
  );
  handle.addToDataDefinition(
    defID,
    'ENG ANTI ICE:2',
    'bool',
    SimConnectDataType.INT32
  );
  handle.addToDataDefinition(
    defID,
    'ENG ANTI ICE:3',
    'bool',
    SimConnectDataType.INT32
  );
  handle.addToDataDefinition(
    defID,
    'ENG ANTI ICE:4',
    'bool',
    SimConnectDataType.INT32
  );
  handle.addToDataDefinition(
    defID,
    'PROP DEICE SWITCH:1',
    'bool',
    SimConnectDataType.INT32
  );
  handle.addToDataDefinition(
    defID,
    'PROP DEICE SWITCH:2',
    'bool',
    SimConnectDataType.INT32
  );
  handle.addToDataDefinition(
    defID,
    'PROP DEICE SWITCH:3',
    'bool',
    SimConnectDataType.INT32
  );
  handle.addToDataDefinition(
    defID,
    'PROP DEICE SWITCH:4',
    'bool',
    SimConnectDataType.INT32
  );
};

export const readIceRequest = (simObjectData: RecvSimObjectData): IceData => {
  const data = simObjectData.data;
  return {
    pitot: data.readFloat64(),
    structural: data.readFloat64(),
    antiIce: {
      general: !!data.readInt32(),
      pitot: !!data.readInt32(),
      structural: !!data.readInt32(),
      windshield: !!data.readInt32(),
      engines: [
        !!data.readInt32(),
        !!data.readInt32(),
        !!data.readInt32(),
        !!data.readInt32(),
      ],
      props: [
        !!data.readInt32(),
        !!data.readInt32(),
        !!data.readInt32(),
        !!data.readInt32(),
      ],
    },
  };
};
