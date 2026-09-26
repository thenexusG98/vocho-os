import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Grid, OrbitControls } from "@react-three/drei";

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
      <header className="grid h-14 shrink-0 grid-cols-[1fr_auto_1fr] items-center border-b border-zinc-800 px-4 sm:px-6">
        <div className="min-w-0">
          <h1 className="text-xl font-bold leading-tight sm:text-2xl">
            VOCHO <span className="text-red-600">OS</span>
          </h1>
          <p className="truncate text-xs text-zinc-500">Vehicle Operating System</p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-emerald-400 sm:text-sm">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          ONLINE
        </div>

        <div className="flex items-center justify-end gap-3 sm:gap-6">
          <div className="text-right">
            <div className="text-lg font-semibold tabular-nums sm:text-xl">
              {time.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <div className="hidden text-xs text-zinc-500 sm:block">
              {time.toLocaleDateString()}
            </div>
          </div>
          <div className="border-l border-zinc-800 pl-3 text-right sm:pl-6">
            <div className="text-xs text-zinc-500">BATERÍA</div>
            <div className="text-base font-semibold tabular-nums sm:text-lg">
              {vehicle.battery.toFixed(1)} V
            </div>
          </div>
        </div>
      </header>

      <main className="grid min-h-0 flex-1 gap-4 overflow-auto p-4 pb-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(330px,0.9fr)] xl:gap-5 xl:p-5">
        <div className="flex min-h-[430px] flex-col gap-3 lg:min-h-0">
          <section className="relative min-h-52 flex-1 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
            <div className="pointer-events-none absolute left-4 top-4 z-10 rounded-md border border-zinc-700 bg-black/70 px-3 py-1.5 text-xs font-semibold tracking-widest text-zinc-300">
              VOCHO 3D
            </div>
            <Canvas camera={{ position: [14, 18, 34], fov: 45 }}>
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
                windowPositions={vehicle.windows}
                lights={vehicle.lights}
                enablePartSelection={false}
                onModelClick={() => onNavigate("vehicle")}
              />
              <OrbitControls enableDamping minDistance={6} maxDistance={35} />
            </Canvas>
          </section>

          <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-3 xl:p-4">
            <div className="flex items-end justify-between gap-5">
              <div>
                <div className="text-xs font-semibold tracking-[0.18em] text-zinc-400">
                  VELOCIDAD
                </div>
                <div className="mt-2 flex items-baseline gap-3">
                  <span className="text-7xl font-semibold leading-none tabular-nums transition-all sm:text-8xl">
                    {vehicle.speed.toFixed(0)}
                  </span>
                  <span className="text-sm font-semibold tracking-wider text-zinc-400">KM/H</span>
                </div>
              </div>
              <div className="hidden w-2/5 pb-2 sm:block">
                <div className="mb-2 flex justify-between text-xs text-zinc-500">
                  <span>0</span>
                  <span>120 KM/H</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-red-600 transition-[width] duration-500"
                    style={{ width: `${Math.min(vehicle.speed / 1.2, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="grid content-start gap-3 lg:min-h-0">
          <section aria-label="Telemetría" className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="min-w-0 rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 sm:p-3">
              <div className="text-xs font-semibold tracking-wider text-zinc-500">RPM</div>
              <div className="mt-1 text-xl font-semibold tabular-nums sm:text-3xl">
                {vehicle.rpm}
              </div>
            </div>
            <div className="min-w-0 rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 sm:p-3">
              <div className="text-xs font-semibold tracking-wider text-zinc-500">BATERÍA</div>
              <div className="mt-1 text-xl font-semibold tabular-nums sm:text-3xl">
                {vehicle.battery.toFixed(1)} V
              </div>
            </div>
            <div className="min-w-0 rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 sm:p-3">
              <div className="text-xs font-semibold tracking-wider text-zinc-500">TEMP.</div>
              <div className="mt-1 text-xl font-semibold tabular-nums sm:text-3xl">
                {vehicle.temperature.toFixed(0)} °C
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-2 text-sm font-bold tracking-[0.16em] text-zinc-300">
              CONTROLES
            </h2>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-2 xl:gap-3 [&>button]:h-14 [&>button]:w-full [&>button]:min-w-0 [&>button]:rounded-lg xl:[&>button]:h-20">
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
                label={vehicle.doorsLocked ? "Desbloquear" : "Bloquear"}
                active={vehicle.doorsLocked}
                onClick={toggleDoors}
              />
              <MenuButton
                icon="📷"
                label="Cámara"
                onClick={() => onNavigate("camera")}
              />
              <MenuButton
                icon="🔧"
                label="Diagnóstico"
                onClick={() => onNavigate("diagnostics")}
              />
            </div>
          </section>

          <section className="rounded-lg border border-zinc-800 bg-zinc-950 p-2">
            <h2 className="mb-1 text-xs font-bold tracking-[0.16em] text-zinc-400">
              SISTEMA DEL VEHÍCULO
            </h2>
            <div className="grid grid-cols-2 gap-1">
              <div className="flex min-w-0 items-center justify-between gap-2 rounded-md bg-zinc-900 px-2 py-1.5">
                <span className="flex items-center gap-2 text-xs text-zinc-300 sm:text-sm">
                  <span className={`h-2 w-2 rounded-full ${vehicle.lights ? "bg-red-500" : "bg-zinc-600"}`} />
                  Luces
                </span>
                <span className="text-xs font-semibold text-zinc-400">{vehicle.lights ? "ON" : "OFF"}</span>
              </div>
              <div className="flex min-w-0 items-center justify-between gap-2 rounded-md bg-zinc-900 px-2 py-1.5">
                <span className="flex items-center gap-2 text-xs text-zinc-300 sm:text-sm">
                  <span className={`h-2 w-2 rounded-full ${vehicle.wipers ? "bg-red-500" : "bg-zinc-600"}`} />
                  Wipers
                </span>
                <span className="text-xs font-semibold text-zinc-400">{vehicle.wipers ? "ON" : "OFF"}</span>
              </div>
              <div className="flex min-w-0 items-center justify-between gap-2 rounded-md bg-zinc-900 px-2 py-1.5">
                <span className="flex items-center gap-2 text-xs text-zinc-300 sm:text-sm">
                  <span className={`h-2 w-2 rounded-full ${vehicle.doorsLocked ? "bg-red-500" : "bg-zinc-600"}`} />
                  Puertas
                </span>
                <span className="text-right text-xs font-semibold text-zinc-400">
                  {vehicle.doorsLocked ? "BLOQUEADAS" : "ABIERTAS"}
                </span>
              </div>
              <div className="flex min-w-0 items-center justify-between gap-2 rounded-md bg-zinc-900 px-2 py-1.5">
                <span className="flex items-center gap-2 text-xs text-zinc-300 sm:text-sm">
                  <span className={`h-2 w-2 rounded-full ${vehicle.gps ? "bg-red-500" : "bg-zinc-600"}`} />
                  GPS
                </span>
                <span className="text-xs font-semibold text-zinc-400">{vehicle.gps ? "ON" : "OFF"}</span>
              </div>
            </div>
          </section>
        </div>
      </main>

      <div className="flex shrink-0 justify-end px-4 pb-2 sm:px-5 [&>div]:!static [&>div]:!left-auto [&>div]:!right-auto [&>div]:!bottom-auto [&>div]:!w-full [&>div]:!max-w-[420px] [&>div]:!z-auto">
        <MiniPlayer onOpen={() => onNavigate("media")} />
      </div>
    </div>
  );
}