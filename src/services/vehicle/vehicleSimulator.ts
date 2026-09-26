import type { VehicleState } from "../../types/vehicle";

export type VehicleTelemetry = Pick<
  VehicleState,
  "speed" | "rpm" | "battery" | "temperature"
>;

export type VehicleStateReader = () => VehicleState;
export type VehicleTelemetryListener = (telemetry: VehicleTelemetry) => void;

export function simulateVehicleState(state: VehicleState): VehicleTelemetry {
  const speed = Math.max(0, Math.min(120, state.speed + (Math.random() - 0.5) * 4));

  return {
    speed,
    rpm: speed === 0
      ? 850
      : Math.round(1000 + speed * 35 + Math.random() * 200),
    battery: Math.max(11, Math.min(14.8, state.battery + (Math.random() - 0.5) * 0.02)),
    temperature: Math.max(
      60,
      Math.min(120, state.temperature + (Math.random() - 0.5) * 0.5),
    ),
  };
}

export function startVehicleSimulator(
  getState: VehicleStateReader,
  onTelemetry: VehicleTelemetryListener,
): () => void {
  const interval = setInterval(() => {
    onTelemetry(simulateVehicleState(getState()));
  }, 1000);

  return () => clearInterval(interval);
}