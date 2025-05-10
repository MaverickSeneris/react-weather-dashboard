import { useState, useEffect } from "react";

const defaultSettings = {
  temperature: "Celsius",
  windSpeed: "km/h",
  pressure: "mm",
  precipitation: "Millimeters",
  distance: "Miles",
  notifications: true,
  timeFormat: true,
  location: true,
  dark: false,
};

export function useWeatherSettings() {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("weatherSettings");

    if (saved) {
      const parsed = JSON.parse(saved);
      console.log("[INIT] Weather settings loaded from localStorage:", parsed);
      return parsed;
    }

    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const initial = { ...defaultSettings, dark: prefersDark };
    localStorage.setItem("weatherSettings", JSON.stringify(initial));
    console.log(
      "[INIT] No saved settings. Using system dark mode:",
      prefersDark
    );
    return initial;
  });

  useEffect(() => {
    localStorage.setItem("weatherSettings", JSON.stringify(settings));
    console.log("[UPDATE] Weather settings saved:", settings);
  }, [settings]);

  const updateSetting = (key, value) => {
    console.log(`[SET] ${key} \u2192 ${value}`);
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const toggleSetting = (key) => {
    console.log(`[TOGGLE] ${key} \u2192 ${!settings[key]}`);
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    if (settings.dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [settings.dark]);

  return { settings, updateSetting, toggleSetting };
}
