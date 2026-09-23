import type { windowSide, WindowState } from "../types/windows";

let state: WindowState = {
  driver: 100,
  passenger: 100,
};

export function getWindowState(): WindowState {
  return { ...state };
}

export function setWindowPosition(
    side: windowSide, 
    position: number
): WindowState {

    position = Math.max(0, Math.min(100, position));

    state = {
        ...state,
        [side]: position,
    }

    return { ...state };
}

export function moveWindow(
    side: windowSide, 
    direction: "up" | "down"
): WindowState {

    const current = state[side];
    const step = 5;

    const newPosition = 
    direction === "up"
    ? current + step
    : current - step;

    return setWindowPosition(side, newPosition);
}