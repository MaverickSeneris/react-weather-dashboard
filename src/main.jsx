import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { applyTheme, getSystemMode } from "./utils/themes";

// Initialize theme BEFORE rendering to prevent flash
const initTheme = () => {
  try {
    const saved = localStorage.getItem("weatherSettings");
    let themeStyle = "gruvbox";
    let themeMode = "system";
    
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        themeStyle = settings.themeStyle || "gruvbox";
        themeMode = settings.themeMode || "system";
        
        // Handle migration from old dark setting
        if (settings.dark !== undefined && !settings.themeMode) {
          themeMode = settings.dark ? "dark" : "light";
        }
      } catch (e) {
        console.error("Error parsing saved settings:", e);
      }
    }
    
    let mode = themeMode;
    if (mode === "system") {
      mode = getSystemMode();
    }
    
    console.log(`[INIT THEME] Applying theme: ${themeStyle}, mode: ${mode}`);
    applyTheme(themeStyle, mode);
  } catch (error) {
    console.error("Error initializing theme:", error);
    // Fallback to gruvbox light
    applyTheme("gruvbox", "light");
  }
};

// Apply theme immediately - this runs before React renders
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initTheme);
} else {
  initTheme();
}

createRoot(document.getElementById("root")).render(
  // <StrictMode>
    <App/>
  // </StrictMode>
);
