import type { WindowState } from "./windows";

export type VehicleMode = "simulation" | "hardware";

export interface VehicleState {
  speed: number;
  rpm: number;
  battery: number;
  temperature: number;
  fuel: number;
  lights: boolean;
  wipers: boolean;
  waterPump: boolean;
  doorsLocked: boolean;
  gps: boolean;
  camera: boolean;
  windows: WindowState;
  mode: VehicleMode;
}