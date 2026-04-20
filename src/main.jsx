import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/global.css";
import { useUIStore } from "./store/uiStore";

// Sobreescribir window.alert nativo
window.alert = (message) => {
  useUIStore.getState().showToast(message, 'error');
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
