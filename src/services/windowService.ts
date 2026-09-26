import type { windowSide, WindowState } from "../types/windows";

const DEFAULT_WINDOW_STATE: WindowState = {
  driver: 100,
  passenger: 100,
};

export function getWindowState(): WindowState {
  return { ...DEFAULT_WINDOW_STATE };
}

export function setWindowPosition(
    side: windowSide,
    position: number,
    currentState: WindowState = getWindowState(),
): WindowState {
    const boundedPosition = Number.isFinite(position)
        ? Math.max(0, Math.min(100, position))
        : currentState[side];

    return { ...currentState, [side]: boundedPosition };
}

export function moveWindow(
    side: windowSide,
    direction: "up" | "down",
    currentState: WindowState = getWindowState(),
): WindowState {
    const current = currentState[side];
    const step = 5;
    const newPosition = direction === "up" ? current + step : current - step;

    return setWindowPosition(side, newPosition, currentState);
}