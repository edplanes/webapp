export type LocationRequestData = {
  latitude: number;
  longitude: number;
  indicatedAltitude: number;
  altitude: number;
  altitudeAboveGround: number;
  heading: number;
  magneticHeading: number;
  magneticVariation: number;
  track: number;
  bank: number;
  pitch: number;
  gforce: number;
  onGround: boolean;
  onRunway: boolean;
  accelarationX: number;
  accelarationY: number;
  accelarationZ: number;
  slew: boolean;
  stallAlpha: number;
  angleOfAttack: number;
  zeroLiftAoA: number;
};

export type SpeedData = {
  indicatedAirspeed: number;
  trueAirspeed: number;
  mach: number;
  groundSpeed: number;
  verticalSpeed: number;
  touchDownRate: number;
  velocityX: number;
  velocityY: number;
  velocityZ: number;
  overspeed: boolean;
};

export type IceData = {
  pitot: number;
  structural: number;
  antiIce: {
    general: boolean;
    pitot: boolean;
    structural: boolean;
    windshield: boolean;
    engines: boolean[];
    props: boolean[];
  };
};

export type WeightsData = {
  fuel: number;
  total: number;
};

export type FlapsData = {
  overspeed: boolean;
  flapsPosition: number;
};

export type AircraftData = {
  configTitle: string;
  filename: string;
  engines: number;
};

export type SystemData = {
  framesPerSecond: number;
  simRate: number;
  isPaused: boolean;
  unlimitedFuel: boolean;
};

export type PowerData = {
  external: boolean;
  apu: boolean;
  engines: boolean[];
};

export type LightsData = {
  beacon: boolean;
  landing: boolean;
  nav: boolean;
  strobe: boolean;
  taxi: boolean;
};

export type GearData = {
  parkingBrake: boolean;
  gearExtention: number;
  speedExceeded: boolean;
  damaged: boolean;
};

export type PositionRequestPayload = {
  location: LocationRequestData;
  system: SystemData;
  speed: SpeedData;
  ice: IceData;
  weights: WeightsData;
};

export type FlapsRequestPayload = {
  flaps: FlapsData;
};

export type AircraftRequestPayload = {
  aircraft: AircraftData;
};

export type GearRequestPayload = {
  gear: GearData;
};

export type LightsRequestPayload = {
  lights: LightsData;
};

export type PowerRequestPayload = {
  power: PowerData;
};

export type RequestData<T> = {
  type: string;
  createdAt: Date;
  payload: {
    timestamp: number;
    frame: number;
  } & PositionRequestPayload &
    T;
};
