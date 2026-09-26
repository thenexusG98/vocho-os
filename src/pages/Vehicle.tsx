import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Grid } from "@react-three/drei";

import VochoModel from "../components/Vehicle3D";
import WindowControls from "../components/windowControls";

import { moveWindow } from "../services/windowService";
import { useVehicle } from "../store/vehicleStore";
import type { AppScreen } from "../types/navigation";
import type { windowSide } from "../types/windows";

interface VehicleProps {
  onNavigate: (screen: AppScreen) => void;
}

export default function Vehicle({ onNavigate }: VehicleProps) {

    const [selectedWindow, setSelectedWindow] = useState<windowSide | null>(null);
    const [selectedHeadlight, setSelectedHeadlight] = useState<
      "faro_izquierdo" | "faro_derecho" | null
    >(null);
    const { state, toggleLights, setWindowPosition } = useVehicle();

    function selectWindow(side: windowSide) {
        setSelectedWindow(side);
    }

    function moveSelectedWindow(direction: "up" | "down") {
        if (!selectedWindow) return;

        const nextWindows = moveWindow(selectedWindow, direction, state.windows);
        setWindowPosition(selectedWindow, nextWindows[selectedWindow]);
    }

    function setSelectedWindowPosition(position: number) {
      if (!selectedWindow) return;

      setWindowPosition(selectedWindow, position);
    }

  return (
    <div className="h-[calc(100dvh-5rem)] w-full bg-black text-white">
      <div className="absolute top-0 left-0 z-10 p-6">
        <h1 className="text-2xl font-bold">
          VOCHO <span className="text-red-600">OS</span>
        </h1>

        <p className="text-sm text-zinc-500">Control del vehículo</p>
      </div>

      <button
        type="button"
        className="absolute top-6 right-6 z-10 rounded-xl bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800"
        onClick={() => onNavigate("dashboard")}
      >
        Volver al dashboard
      </button>

      {selectedWindow && (
        <WindowControls
          side={selectedWindow}
          position={state.windows[selectedWindow]}
          onUp={() => moveSelectedWindow("up")}
          onDown={() => moveSelectedWindow("down")}
          onFullyDown={() => setSelectedWindowPosition(0)}
          onFullyUp={() => setSelectedWindowPosition(100)}
        />
      )}

      <Canvas
        camera={{
          position: [14, 18, 34],
          fov: 45,
        }}
      >
        <ambientLight intensity={1} />

        <directionalLight position={[5, 5, 5]} intensity={2} />

        <Environment preset="city" />

        <Grid
          args={[20, 20]}
          cellSize={1}
          cellThickness={0.5}
          sectionSize={5}
          sectionThickness={1}
        />

        <VochoModel
          windowPositions={state.windows}
          lights={state.lights}
          selectedHeadlight={selectedHeadlight}
          onWindowSelect={selectWindow}
          onHeadlightSelect={(headlight) => {
            setSelectedWindow(null);
            const nextLights = !state.lights;
            toggleLights();
            setSelectedHeadlight(nextLights ? headlight : null);
          }}
          onOtherPartSelect={() => {
            setSelectedWindow(null);
          }}
        />

        <OrbitControls enableDamping minDistance={6} maxDistance={35} />
      </Canvas>
    </div>
  );
}
