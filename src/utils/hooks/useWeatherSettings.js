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
};

export function useWeatherSettings() {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("weatherSettings");
    const initial = saved ? JSON.parse(saved) : defaultSettings;
    console.log("[INIT] Weather settings loaded:", initial);
    return initial;
  });

  useEffect(() => {
    localStorage.setItem("weatherSettings", JSON.stringify(settings));
    console.log("[UPDATE] Weather settings saved:", settings);
  }, [settings]);

  const updateSetting = (key, value) => {
    console.log(`[SET] ${key} → ${value}`);
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const toggleSetting = (key) => {
    console.log(`[TOGGLE] ${key} → ${!settings[key]}`);
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return { settings, updateSetting, toggleSetting };
}
