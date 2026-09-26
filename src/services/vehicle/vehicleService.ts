import type { VehicleMode } from "../../types/vehicle";
import { startVehicleHardware } from "./vehicleHardware";
import {
  startVehicleSimulator,
  type VehicleStateReader,
  type VehicleTelemetryListener,
} from "./vehicleSimulator";

export function startVehicleService(
  mode: VehicleMode,
  getState: VehicleStateReader,
  onTelemetry: VehicleTelemetryListener,
): () => void {
  if (mode === "hardware") {
    return startVehicleHardware(onTelemetry);
  }

  return startVehicleSimulator(getState, onTelemetry);
}