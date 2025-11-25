import { useState, useEffect } from "react";
import { applyTheme, getSystemMode } from "../themes";

const defaultSettings = {
  temperature: "Celsius",
  windSpeed: "km/h",
  pressure: "mm",
  precipitation: "Millimeters",
  distance: "Miles",
  notifications: true,
  timeFormat: true,
  location: true,
  themeMode: "dark", // "light", "dark", or "system"
  themeStyle: "catppuccin", // "gruvbox", "catppuccin", "monokai", "flexbox", "everforest"
  aiEnabled: false, // Toggle for AI features
  aiProvider: "openai", // "openai", "anthropic", "google"
  aiApiKey: "", // User's AI API key
};

export function useWeatherSettings() {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("weatherSettings");

    if (saved) {
      const parsed = JSON.parse(saved);
      // Migrate old settings format
      if (parsed.dark !== undefined && !parsed.themeMode) {
        parsed.themeMode = parsed.dark ? "dark" : "light";
        delete parsed.dark;
      }
      if (!parsed.themeStyle) {
        parsed.themeStyle = "catppuccin";
      }
      // Migrate AI settings
      if (parsed.aiEnabled === undefined) {
        parsed.aiEnabled = false;
      }
      if (!parsed.aiProvider) {
        parsed.aiProvider = "openai";
      }
      if (parsed.aiApiKey === undefined) {
        parsed.aiApiKey = "";
      }
      console.log("[INIT] Weather settings loaded from localStorage:", parsed);
      return parsed;
    }

    const initial = { ...defaultSettings };
    localStorage.setItem("weatherSettings", JSON.stringify(initial));
    console.log("[INIT] No saved settings. Using defaults");
    return initial;
  });

  useEffect(() => {
    localStorage.setItem("weatherSettings", JSON.stringify(settings));
    console.log("[UPDATE] Weather settings saved:", settings);
  }, [settings]);

  // Handle notifications permission and requests
  useEffect(() => {
    if (settings.notifications && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission().then((permission) => {
          console.log("[NOTIFICATIONS] Permission:", permission);
        });
      }
    }
  }, [settings.notifications]);

  const updateSetting = (key, value) => {
    console.log(`[SET] ${key} \u2192 ${value}`);
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const toggleSetting = (key) => {
    console.log(`[TOGGLE] ${key} \u2192 ${!settings[key]}`);
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Apply theme based on settings
  useEffect(() => {
    let mode = settings.themeMode;
    
    if (mode === "system") {
      mode = getSystemMode();
    }
    
    applyTheme(settings.themeStyle || "catppuccin", mode);
  }, [settings.themeMode, settings.themeStyle]);

  // Listen for system theme changes
  useEffect(() => {
    if (settings.themeMode === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => {
        const mode = getSystemMode();
        applyTheme(settings.themeStyle || "catppuccin", mode);
      };
      
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [settings.themeMode, settings.themeStyle]);

  return { settings, updateSetting, toggleSetting };
}
