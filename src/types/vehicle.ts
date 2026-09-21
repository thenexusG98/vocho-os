export interface VehicleState {
  speed: number;
  rpm: number;
  battery: number;
  temperature: number;
  fuel: number;
  lights: boolean;
  wippers: boolean;
  waterPump: boolean;
  doorsLocked: boolean;
  gps: boolean;
}