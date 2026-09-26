import type { AppScreen } from "../types/navigation";

interface BottomNavigationProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
}

const navigationItems: Array<{
  screen: AppScreen;
  icon: string;
  label: string;
}> = [
  { screen: "dashboard", icon: "🏠", label: "Inicio" },
  { screen: "vehicle", icon: "🚗", label: "Vehículo" },
  { screen: "media", icon: "🎵", label: "Música" },
  { screen: "gps", icon: "🧭", label: "GPS" },
  { screen: "settings", icon: "⚙️", label: "Ajustes" },
];

export default function BottomNavigation({
  currentScreen,
  onNavigate,
}: BottomNavigationProps) {
  return (
    <nav
      aria-label="Navegación principal"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-zinc-800 bg-zinc-950/95 pb-[env(safe-area-inset-bottom)] backdrop-blur"
    >
      <div className="mx-auto grid max-w-5xl grid-cols-5 gap-1 px-2">
        {navigationItems.map(({ screen, icon, label }) => {
          const isActive = currentScreen === screen;

          return (
            <button
              key={screen}
              type="button"
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
              onClick={() => onNavigate(screen)}
              className={`flex min-h-20 flex-col items-center justify-center gap-1 rounded-lg px-1 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500 ${
                isActive
                  ? "bg-red-950/70 text-white"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
              }`}
            >
              <span aria-hidden="true" className="text-2xl leading-none">
                {icon}
              </span>
              <span className="truncate">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}