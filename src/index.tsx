import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { VehicleProvider } from './store/vehicleStore'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <VehicleProvider>
      <App />
    </VehicleProvider>
  </React.StrictMode>,
)
