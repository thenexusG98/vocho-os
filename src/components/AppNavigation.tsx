import Dashboard from "../pages/Dashboard";
import Media from "../pages/Media";
import Vehicle from "../pages/Vehicle";
import type { AppScreen } from "../types/navigation";

interface AppNavigationProps {
  screen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
}

const placeholderTitles: Partial<Record<AppScreen, string>> = {
  gps: "GPS",
  camera: "Cámara",
  diagnostics: "Diagnóstico",
  settings: "Configuración",
};

export default function AppNavigation({
  screen,
  onNavigate,
}: AppNavigationProps) {
  switch (screen) {
    case "dashboard":
      return <Dashboard onNavigate={onNavigate} />;
    case "vehicle":
      return <Vehicle onNavigate={onNavigate} />;
    case "media":
      return <Media onNavigate={onNavigate} />;
    default: {
      const title = placeholderTitles[screen];

      return (
        <main className="grid min-h-[calc(100dvh-5rem)] place-items-center bg-black px-6 pb-24 text-white">
          <section className="w-full max-w-xl rounded-lg border border-zinc-800 bg-zinc-950 p-8 text-center">
            <p className="text-sm font-semibold uppercase text-red-500">VOCHO OS</p>
            <h1 className="mt-3 text-3xl font-bold">{title}</h1>
            <p className="mt-3 text-lg text-zinc-400">Módulo en desarrollo</p>
          </section>
        </main>
      );
    }
  }
}