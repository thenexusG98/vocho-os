import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useReducer,
  useRef,
  type PropsWithChildren,
} from "react";
import { getWindowState, setWindowPosition as updateWindowPosition } from "../services/windowService";
import { startVehicleService } from "../services/vehicle/vehicleService";
import type { VehicleMode, VehicleState } from "../types/vehicle";
import type { windowSide } from "../types/windows";

export type VehicleAction =
  | { type: "SET_SPEED"; payload: number }
  | { type: "SET_RPM"; payload: number }
  | { type: "SET_BATTERY"; payload: number }
  | { type: "SET_TEMPERATURE"; payload: number }
  | { type: "TOGGLE_LIGHTS" }
  | { type: "TOGGLE_WIPERS" }
  | { type: "TOGGLE_DOORS" }
  | { type: "SET_WINDOW_POSITION"; payload: { side: windowSide; position: number } }
  | { type: "SET_GPS"; payload: boolean }
  | { type: "SET_CAMERA"; payload: boolean }
  | { type: "SET_MODE"; payload: VehicleMode };

export const initialVehicleState: VehicleState = {
  speed: 0,
  rpm: 850,
  battery: 12.6,
  temperature: 82,
  fuel: 67,
  lights: false,
  wipers: false,
  waterPump: false,
  doorsLocked: true,
  gps: true,
  camera: false,
  windows: getWindowState(),
  mode: "simulation",
};

function boundedValue(value: number, minimum: number, maximum: number, fallback: number) {
  return Number.isFinite(value)
    ? Math.max(minimum, Math.min(maximum, value))
    : fallback;
}

export function vehicleReducer(state: VehicleState, action: VehicleAction): VehicleState {
  switch (action.type) {
    case "SET_SPEED":
      return { ...state, speed: boundedValue(action.payload, 0, 300, state.speed) };
    case "SET_RPM":
      return { ...state, rpm: boundedValue(action.payload, 0, 10000, state.rpm) };
    case "SET_BATTERY":
      return { ...state, battery: boundedValue(action.payload, 0, 20, state.battery) };
    case "SET_TEMPERATURE":
      return { ...state, temperature: boundedValue(action.payload, -40, 200, state.temperature) };
    case "TOGGLE_LIGHTS":
      return { ...state, lights: !state.lights };
    case "TOGGLE_WIPERS":
      return { ...state, wipers: !state.wipers };
    case "TOGGLE_DOORS":
      return { ...state, doorsLocked: !state.doorsLocked };
    case "SET_WINDOW_POSITION":
      return {
        ...state,
        windows: updateWindowPosition(
          action.payload.side,
          action.payload.position,
          state.windows,
        ),
      };
    case "SET_GPS":
      return { ...state, gps: action.payload };
    case "SET_CAMERA":
      return { ...state, camera: action.payload };
    case "SET_MODE":
      return { ...state, mode: action.payload };
    default:
      return state;
  }
}

interface VehicleContextValue {
  state: VehicleState;
  toggleLights: () => void;
  toggleWipers: () => void;
  toggleDoors: () => void;
  setWindowPosition: (side: windowSide, position: number) => void;
  setSpeed: (speed: number) => void;
  setRpm: (rpm: number) => void;
  setBattery: (battery: number) => void;
  setTemperature: (temperature: number) => void;
  setGps: (enabled: boolean) => void;
  setCamera: (enabled: boolean) => void;
  setMode: (mode: VehicleMode) => void;
}

const VehicleContext = createContext<VehicleContextValue | null>(null);

export function VehicleProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(vehicleReducer, initialVehicleState);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => startVehicleService(
    state.mode,
    () => stateRef.current,
    (telemetry) => {
      dispatch({ type: "SET_SPEED", payload: telemetry.speed });
      dispatch({ type: "SET_RPM", payload: telemetry.rpm });
      dispatch({ type: "SET_BATTERY", payload: telemetry.battery });
      dispatch({ type: "SET_TEMPERATURE", payload: telemetry.temperature });
    },
  ), [state.mode]);

  const value: VehicleContextValue = {
    state,
    toggleLights: () => dispatch({ type: "TOGGLE_LIGHTS" }),
    toggleWipers: () => dispatch({ type: "TOGGLE_WIPERS" }),
    toggleDoors: () => dispatch({ type: "TOGGLE_DOORS" }),
    setWindowPosition: (side, position) => dispatch({
      type: "SET_WINDOW_POSITION",
      payload: { side, position },
    }),
    setSpeed: (speed) => dispatch({ type: "SET_SPEED", payload: speed }),
    setRpm: (rpm) => dispatch({ type: "SET_RPM", payload: rpm }),
    setBattery: (battery) => dispatch({ type: "SET_BATTERY", payload: battery }),
    setTemperature: (temperature) => dispatch({ type: "SET_TEMPERATURE", payload: temperature }),
    setGps: (enabled) => dispatch({ type: "SET_GPS", payload: enabled }),
    setCamera: (enabled) => dispatch({ type: "SET_CAMERA", payload: enabled }),
    setMode: (mode) => dispatch({ type: "SET_MODE", payload: mode }),
  };

  return createElement(VehicleContext.Provider, { value }, children);
}

export function useVehicle(): VehicleContextValue {
  const context = useContext(VehicleContext);
  if (!context) {
    throw new Error("useVehicle debe utilizarse dentro de <VehicleProvider>.");
  }

  return context;
}