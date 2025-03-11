import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { UserContextProvider } from "./context/UserContext.jsx";
import { RiderProvider } from "./context/RiderContext.jsx";
import { DriverProvider } from "./context/DriverContext.jsx";
import { AdminProvider } from "./context/AdminContext.jsx";
import { DriverDashboardProvider } from "./context/DriverDashboardContext..jsx";
export const server = "http://localhost:5000";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RiderProvider>
      <DriverProvider>
        <UserContextProvider>
          <DriverDashboardProvider>
            <AdminProvider>
              <App />
            </AdminProvider>
          </DriverDashboardProvider>
        </UserContextProvider>
      </DriverProvider>
    </RiderProvider>
  </StrictMode>
);
