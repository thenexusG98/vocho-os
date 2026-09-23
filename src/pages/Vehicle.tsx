import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Grid } from "@react-three/drei";

import VochoModel from "../components/Vehicle3D";
import { VehiclePart } from "../enums/vehiclePart";

export default function Vehicle() {
  function handlePartClick(partName: string) {
    const selectedPart = Object.entries(VehiclePart).find(
      ([modelPartName]) => modelPartName === partName,
    );

    console.log("Parte seleccionada:", selectedPart?.[1] ?? partName);
  }

  return (
    <div className="w-full h-screen bg-black text-white">
      <div className="absolute top-0 left-0 z-10 p-6">
        <h1 className="text-2xl font-bold">
          VOCHO <span className="text-red-600">OS</span>
        </h1>

        <p className="text-sm text-zinc-500">Control del vehículo</p>
      </div>

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

        <VochoModel onClickPart={handlePartClick} />

        <OrbitControls enableDamping minDistance={6} maxDistance={35} />
      </Canvas>
    </div>
  );
}
