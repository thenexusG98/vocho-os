import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Grid } from "@react-three/drei";

import VochoModel from "../components/Vehicle3D";
import WindowControls from "../components/windowControls";

import {
  getWindowState,
  moveWindow,
  setWindowPosition,
} from "../services/windowService";
import type { windowSide, WindowState } from "../types/windows";

export default function Vehicle() {

    const [selectedWindow, setSelectedWindow] = useState<windowSide | null>(null);
    const [windows, setWindows] = useState<WindowState>(getWindowState());

    function selectWindow(side: windowSide) {
        setSelectedWindow(side);
    }

    function moveSelectedWindow(direction: "up" | "down") {
        if (!selectedWindow) return;

        setWindows(moveWindow(selectedWindow, direction));
    }

    function setSelectedWindowPosition(position: number) {
      if (!selectedWindow) return;

      setWindows(setWindowPosition(selectedWindow, position));
    }

  return (
    <div className="w-full h-screen bg-black text-white">
      <div className="absolute top-0 left-0 z-10 p-6">
        <h1 className="text-2xl font-bold">
          VOCHO <span className="text-red-600">OS</span>
        </h1>

        <p className="text-sm text-zinc-500">Control del vehículo</p>
      </div>

      {selectedWindow && (
        <WindowControls
          side={selectedWindow}
          position={windows[selectedWindow]}
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
          windowPositions={windows}
          onWindowSelect={selectWindow}
          onOtherPartSelect={() => setSelectedWindow(null)}
        />

        <OrbitControls enableDamping minDistance={6} maxDistance={35} />
      </Canvas>
    </div>
  );
}
