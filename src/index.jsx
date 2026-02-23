import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { BlinkProvider, BlinkAuthProvider } from "@blinkdotnew/react";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BlinkProvider 
      projectId={import.meta.env.VITE_BLINK_PROJECT_ID || "admin-dashboard-app-o3nqai8g"} 
      publishableKey={import.meta.env.VITE_BLINK_PUBLISHABLE_KEY || "blnk_pk_b01f0b3f"}
    >
      <BlinkAuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </BlinkAuthProvider>
    </BlinkProvider>
  </React.StrictMode>
);
