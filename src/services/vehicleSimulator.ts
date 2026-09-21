import { VehicleState } from '../types/vehicle';

let state: VehicleState = {
  speed: 0,
  rpm: 850,
  battery: 12.6,
  temperature: 82,
  fuel: 67,
  lights: false,
  wippers: false,
  waterPump: false,
  doorsLocked: true,
  gps: true,
};

export function getVehicleState(): VehicleState {
  return { ...state };
};

export function updateVehicleState(changes: Partial<VehicleState>
): VehicleState {
  state = { 
    ...state, 
    ...changes 
};
  return { ...state };
}

export function simulateVehicleState() {
    state.speed = Math.max(
        0,
        Math.min(120, state.speed + (Math.random() - 0.5) * 4)
    );

    state.rpm = 
      state.speed === 0 
      ? 850 
      : Math.round(1000 + state.speed * 35 + Math.random() * 200);

    state.temperature += (Math.random() - 0.5) * 0.5;

    return { ...state };
}