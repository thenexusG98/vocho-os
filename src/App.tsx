import { useState } from "react";
import AppNavigation from "./components/AppNavigation";
import BottomNavigation from "./components/BottomNavigation";
import type { AppScreen } from "./types/navigation";

function App() {
  const [screen, setScreen] = useState<AppScreen>("dashboard");

  return (
    <div className="min-h-screen overflow-x-hidden bg-black text-white">
      <AppNavigation screen={screen} onNavigate={setScreen} />
      <BottomNavigation currentScreen={screen} onNavigate={setScreen} />
    </div>
  );
}

export default App;
