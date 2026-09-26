import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { VehicleProvider } from "./store/vehicleStore";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <VehicleProvider>
            <App />
        </VehicleProvider>
    </StrictMode>
);