import React, { useState, useEffect } from "react";
import Card from "../components/ui/Card"
const defaultSettings = {
  temperature: "Celsius", // Metric
  windSpeed: "km/h", // Metric
  pressure: "mm", // Metric
  precipitation: "Millimeters", // Metric
  distance: "Kilometers", // Metric
  notifications: true,
  timeFormat: true, // true = 12-Hour
  location: true,
};

export default function WeatherSettings() {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("weatherSettings");
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem("weatherSettings", JSON.stringify(settings));
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderOptionGroup = (title, key, options) => (
    <div className="flex flex-col">
      <h4 className="font-semibold text-gray-300 mt-1">{title}</h4>
      <div
        className={`flex gap-1 mt-2 mb-4 bg-[#0b0b1d] p-1 rounded-[10px] justify-around ${
          key === "pressure" ? "flex-nowrap" : "flex-wrap"
        }`}
      >
        {options.map((option) => (
          <button
            key={option}
            onClick={() => updateSetting(key, option)}
            className={`${
              key === "pressure" || key === "windSpeed"
                ? "w-[32%] text-xs px-2 py-1"
                : "w-[49%] min-w-[10%] px-10 py-1.5 text-sm"
            } text-center rounded-[7px] transition-all ${
              settings[key] === option
                ? "bg-gray-700 text-white shadow-md"
                : "text-gray-300 hover:bg-gray-600"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );

  const renderToggle = (label, key) => (
    <div className="flex items-center justify-between mt-4">
      <span className="text-sm text-gray-300">{label}</span>
      <label className="inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={settings[key]}
          onChange={() => toggleSetting(key)}
          className="sr-only"
        />
        <div className="w-10 h-5 bg-blue-600 rounded-full peer peer-checked:bg-blue-500 relative transition-all">
          <div
            className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
              settings[key] ? "translate-x-5" : ""
            }`}
          ></div>
        </div>
      </label>
    </div>
  );

  return (
    <Card>
      {/* <div className="p-6 bg-gray-900 text-white w-full max-w-xs rounded-2xl shadow-xl"> */}
        {renderOptionGroup("Temperature", "temperature", [
          "Celsius",
          "Fahrenheit",
        ])}
        {renderOptionGroup("Wind Speed", "windSpeed", ["km/h", "m/s", "Knots"])}
        {renderOptionGroup("Pressure", "pressure", [
          "hPa",
          "Inches",
          "kPa",
          "mm",
        ])}
        {renderOptionGroup("Precipitation", "precipitation", [
          "Millimeters",
          "Inches",
        ])}
        {renderOptionGroup("Distance", "distance", ["Kilometers", "Miles"])}

        <div className="mt-6 border-t border-gray-700 pt-4">
          <h4 className="text-gray-400 font-semibold mb-2">Notifications</h4>
          {renderToggle("Be aware of the weather", "notifications")}
        </div>

        <div className="mt-6 border-t border-gray-700 pt-4">
          <h4 className="text-gray-400 font-semibold mb-2">General</h4>
          {renderToggle("12-Hour Time", "timeFormat")}
          {renderToggle("Location", "location")}
        </div>
      {/* </div> */}
    </Card>
  );
}
