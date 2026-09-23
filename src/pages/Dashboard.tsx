import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Grid, OrbitControls } from "@react-three/drei";
import StatusCard from "../components/StatusCard";
import MenuButton from "../components/MenuButton";
import VochoModel from "../components/Vehicle3D";

import {
  getVehicleState,
  simulateVehicleState,
  updateVehicleState,
} from "../services/vehicleSimulator";
import { getWindowState } from "../services/windowService";
import type { VehicleState } from "../types/vehicle";

interface DashboardProps {
  onVehicleClick: () => void;
}

export default function Dashboard({ onVehicleClick }: DashboardProps) {
  const [vehicle, setVehicle] = useState<VehicleState>(getVehicleState());
  const [windowPositions] = useState(getWindowState);

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setVehicle(simulateVehicleState());
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  function toggleLights() {
    setVehicle(
      updateVehicleState({
        lights: !vehicle.lights,
      }),
    );
  }

  function toggleWipers() {
    setVehicle(
      updateVehicleState({
        wippers: !vehicle.wippers,
      }),
    );
  }

  function toggleDoors() {
    setVehicle(
      updateVehicleState({
        doorsLocked: !vehicle.doorsLocked,
      }),
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* HEADER */}

      <header className="h-20 border-b border-zinc-800 px-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            VOCHO <span className="text-red-600">OS</span>
          </h1>

          <p className="text-xs text-zinc-500">Vehicle Operating System</p>
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

      {/* MAIN */}

      <main className="flex-1 p-6 overflow-auto">
        {/* 3D VEHICLE */}

        <section className="h-[420px] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
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
              windowPositions={windowPositions}
              lights={vehicle.lights}
              enablePartSelection={false}
              onModelClick={onVehicleClick}
            />
            <OrbitControls enableDamping minDistance={6} maxDistance={35} />
          </Canvas>
        </section>

        {/* VEHICLE */}

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatusCard
            title="Velocidad"
            value={`${vehicle.speed.toFixed(0)} km/h`}
            icon="🚗"
          />

          <StatusCard title="RPM" value={`${vehicle.rpm}`} icon="⚙️" />

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

        {/* SPEED */}

        <section className="mt-6 rounded-2xl bg-zinc-900 border border-zinc-800 p-8 text-center">
          <div className="text-zinc-500">VELOCIDAD</div>

          <div className="text-7xl font-bold mt-2">
            {vehicle.speed.toFixed(0)}
          </div>

          <div className="text-zinc-500">KM/H</div>

          <div className="mt-6 w-full bg-zinc-800 rounded-full h-3">
            <div
              className="bg-red-600 h-3 rounded-full transition-all"
              style={{
                width: `${Math.min(
                  vehicle.speed / 1.2,

                  100,
                )}%`,
              }}
            />
          </div>
        </section>

        {/* CONTROLS */}

        <section className="mt-6">
          <h2 className="text-lg font-bold mb-3">Controles</h2>

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
              active={vehicle.wippers}
              onClick={toggleWipers}
            />

            <MenuButton
              icon="🔒"
              label={vehicle.doorsLocked ? "Desbloquear" : "Bloquear"}
              active={vehicle.doorsLocked}
              onClick={toggleDoors}
            />

            <MenuButton icon="📷" label="Cámara" />
          </div>
        </section>

        {/* SYSTEM */}

        <section className="mt-6">
          <h2 className="text-lg font-bold mb-3">Sistema</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <MenuButton icon="🎵" label="Música" />

            <MenuButton icon="📍" label="GPS" active={vehicle.gps} />

            <MenuButton icon="🔧" label="Diagnóstico" />

            <MenuButton icon="⚙️" label="Configuración" />
          </div>
        </section>
      </main>

      {/* FOOTER */}

      <footer className="h-14 border-t border-zinc-800 flex items-center justify-center">
        <span className="text-xs text-zinc-600">
          VOCHO OS • DEV MODE • HARDWARE SIMULADO
        </span>
      </footer>
    </div>
  );
}
