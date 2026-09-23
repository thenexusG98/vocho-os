import { useState } from 'react';
import Dashboard from './pages/Dashboard';
import Vehicle from './pages/Vehicle';

function App() {
  const [showVehicle, setShowVehicle] = useState(false);

  return showVehicle ? (
    <Vehicle onBackToDashboard={() => setShowVehicle(false)} />
  ) : (
    <Dashboard onVehicleClick={() => setShowVehicle(true)} />
  );
}

export default App;
