import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { UserContextProvider } from "./context/UserContext.jsx";
import { RiderProvider } from "./context/RiderContext.jsx";
import { DriverProvider } from "./context/DriverContext.jsx";

export const server = "http://localhost:5000";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserContextProvider>
      <RiderProvider>
        <DriverProvider>
          <App />
        </DriverProvider>
      </RiderProvider>
    </UserContextProvider>
  </StrictMode>
);
