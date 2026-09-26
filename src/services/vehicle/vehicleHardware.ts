import type { VehicleTelemetryListener } from "./vehicleSimulator";

export function startVehicleHardware(
  _onTelemetry: VehicleTelemetryListener,
): () => void {
  return () => undefined;
}