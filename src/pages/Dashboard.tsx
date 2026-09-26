import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Grid, OrbitControls } from "@react-three/drei";

import StatusCard from "../components/StatusCard";
import MenuButton from "../components/MenuButton";
import VochoModel from "../components/Vehicle3D";
import MiniPlayer from "../components/media/MiniPlayer";

import { useVehicle } from "../store/vehicleStore";
import type { AppScreen } from "../types/navigation";

interface DashboardProps {
  onNavigate: (screen: AppScreen) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { state: vehicle, toggleLights, toggleWipers, toggleDoors } = useVehicle();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-[calc(100dvh-5rem)] min-h-0 flex-col bg-black text-white">

      {/* HEADER */}
      <header className="h-20 border-b border-zinc-800 px-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            VOCHO <span className="text-red-600">OS</span>
          </h1>

          <p className="text-xs text-zinc-500">
            Vehicle Operating System
          </p>
        </div>

        <div className="text-right">
          <div className="text-xl font-semibold">
            {time.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>

          <div className="text-xs text-zinc-500">
            {time.toLocaleDateString()}
          </div>
        </div>
      </header>

      {/* CONTENIDO */}
      <main className="min-h-0 flex-1 overflow-auto p-6 pb-40">

        {/* VEHÍCULO */}
        <section className="h-[420px] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
          <Canvas camera={{ position: [14, 18, 34], fov: 45 }}>
            <ambientLight intensity={1} />

            <directionalLight
              position={[5, 5, 5]}
              intensity={2}
            />

            <Environment preset="city" />

            <Grid
              args={[20, 20]}
              cellSize={1}
              cellThickness={0.5}
              sectionSize={5}
              sectionThickness={1}
            />

            <VochoModel
              windowPositions={vehicle.windows}
              lights={vehicle.lights}
              enablePartSelection={false}
              onModelClick={() => onNavigate("vehicle")}
            />

            <OrbitControls
              enableDamping
              minDistance={6}
              maxDistance={35}
            />
          </Canvas>
        </section>

        {/* STATUS */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">

          <StatusCard
            title="Velocidad"
            value={`${vehicle.speed.toFixed(0)} km/h`}
            icon="🚗"
          />

          <StatusCard
            title="RPM"
            value={`${vehicle.rpm}`}
            icon="⚙️"
          />

          <StatusCard
            title="Batería"
            value={`${vehicle.battery.toFixed(1)} V`}
            icon="🔋"
          />

          <StatusCard
            title="Temperatura"
            value={`${vehicle.temperature.toFixed(0)} °C`}
            icon="🌡️"
          />

        </section>

        {/* VELOCIDAD */}
        <section className="mt-6 rounded-2xl bg-zinc-900 border border-zinc-800 p-8 text-center">

          <div className="text-zinc-500">
            VELOCIDAD
          </div>

          <div className="text-7xl font-bold mt-2">
            {vehicle.speed.toFixed(0)}
          </div>

          <div className="text-zinc-500">
            KM/H
          </div>

          <div className="mt-6 w-full bg-zinc-800 rounded-full h-3">
            <div
              className="bg-red-600 h-3 rounded-full transition-all"
              style={{
                width: `${Math.min(
                  vehicle.speed / 1.2,
                  100
                )}%`,
              }}
            />
          </div>

        </section>

        {/* CONTROLES */}
        <section className="mt-6">

          <h2 className="text-lg font-bold mb-3">
            Controles
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

            <MenuButton
              icon="💡"
              label="Luces"
              active={vehicle.lights}
              onClick={toggleLights}
            />

            <MenuButton
              icon="🌧️"
              label="Limpiaparabrisas"
              active={vehicle.wipers}
              onClick={toggleWipers}
            />

            <MenuButton
              icon="🔒"
              label={
                vehicle.doorsLocked
                  ? "Desbloquear"
                  : "Bloquear"
              }
              active={vehicle.doorsLocked}
              onClick={toggleDoors}
            />

            <MenuButton
              icon="📷"
              label="Cámara"
              onClick={() => onNavigate("camera")}
            />

          </div>

        </section>

        {/* SISTEMA */}
        <section className="mt-6">

          <h2 className="text-lg font-bold mb-3">
            Sistema
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

            <MenuButton
              icon="🎵"
              label="Música"
              onClick={() => onNavigate("media")}
            />

            <MenuButton
              icon="📍"
              label="GPS"
              active={vehicle.gps}
              onClick={() => onNavigate("gps")}
            />

            <MenuButton
              icon="🔧"
              label="Diagnóstico"
              onClick={() => onNavigate("diagnostics")}
            />

            <MenuButton
              icon="⚙️"
              label="Configuración"
              onClick={() => onNavigate("settings")}
            />

          </div>

        </section>

        <footer className="mt-6 flex h-14 shrink-0 items-center justify-center border-t border-zinc-800">
          <span className="text-xs text-zinc-600">
            VOCHO OS • DEV MODE • HARDWARE SIMULADO
          </span>
        </footer>
      </main>

      {/* MINI PLAYER */}
      <MiniPlayer
        onOpen={() => onNavigate("media")}
      />

    </div>
  );
}