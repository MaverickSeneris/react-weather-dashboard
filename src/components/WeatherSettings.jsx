import React, { useState, useEffect } from "react";
import Card from "../components/ui/Card";
import { useWeatherSettings } from "../utils/hooks/useWeatherSettings";

export default function WeatherSettings() {
  // Destructure settings and update functions from the custom hook
  const { settings, updateSetting, toggleSetting } = useWeatherSettings();

  // Function to handle dark mode toggle and refresh the page with transition
  const handleDarkModeToggle = (key) => {
    toggleSetting(key); // Toggle the setting
    if (key === "dark") {
      // Add a class for fade-out effect
      document.body.classList.add("fade-out");
      // Wait for the fade-out transition before reloading the page
      setTimeout(() => {
        window.location.reload();
      }, 500); // Adjust timeout to match fade duration
    }
  };

  // Function to render a group of option buttons
  const renderOptionGroup = (title, key, options) => (
    <div className="flex flex-col">
      {/* Group title */}
      <h4 className="font-semibold text-slate-500 dark:text-gray-300 mt-1">{title}</h4>
      <div
        className={`flex gap-1 mt-2 mb-4 bg-slate-300 dark:bg-[#0b0b1d] p-1 rounded-[10px] justify-around ${
          key === "pressure" ? "flex-nowrap" : "flex-wrap"
        }`}
      >
        {/* Render buttons for each option */}
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
                ? "bg-slate-100 dark:bg-gray-700 dark:text-white shadow-md"
                : "dark:text-gray-300 hover:bg-gray-600"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );

  // Function to render a toggle switch
  const renderToggle = (label, key) => (
    <div className="flex items-center justify-between mt-4">
      <span className="text-sm dark:text-gray-300">{label}</span>
      <label className="inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={settings[key]}
          onChange={() => handleDarkModeToggle(key)} // Use the updated handler here
          className="sr-only"
        />
        {/* Toggle switch */}
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
      {/* Render option groups */}
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

      {/* Notifications toggle */}
      <div className="mt-6 border-t border-gray-700 pt-4">
        <h4 className="dark:text-gray-400 font-semibold mb-2">Notifications</h4>
        {renderToggle("Be aware of the weather", "notifications")}
      </div>

      {/* General settings toggles */}
      <div className="mt-6 border-t border-gray-700 pt-4">
        <h4 className="dark:text-gray-400 font-semibold mb-2">General</h4>
        {renderToggle("12-Hour Time", "timeFormat")}
        {renderToggle("Location", "location")}
        {renderToggle(settings.dark ? "Dark Mode" : "Light Mode", "dark")}
      </div>
    </Card>
  );
}
