import React, { useState, useEffect } from "react";
import Card from "../components/ui/Card";
import { useWeatherSettings } from "../utils/hooks/useWeatherSettings";
import { IoEye, IoEyeOff } from "react-icons/io5";

export default function WeatherSettings() {
  // Destructure settings and update functions from the custom hook
  const { settings, updateSetting, toggleSetting } = useWeatherSettings();
  const [showApiKey, setShowApiKey] = useState(false);

  // Function to handle dark mode toggle and refresh the page with transition
  const handleDarkModeToggle = (key) => {
    // Handle notifications permission request before toggling
    if (key === "notifications" && !settings.notifications) {
      // User is enabling notifications
      if ("Notification" in window) {
        if (Notification.permission === "default") {
          Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
              console.log("[NOTIFICATIONS] Permission granted");
              toggleSetting(key); // Toggle only after permission is granted
              // Show a test notification
              setTimeout(() => {
                new Notification("Weather Notifications Enabled", {
                  body: "You'll be notified about important weather updates.",
                  icon: "/pwa-192x192.png",
                });
              }, 100);
            } else {
              console.log("[NOTIFICATIONS] Permission denied");
              // Don't toggle if permission was denied
            }
          });
          return; // Don't toggle yet, wait for permission
        } else if (Notification.permission === "granted") {
          toggleSetting(key);
          return;
        }
      }
    }
    
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
      <h4 className="font-semibold mt-1" style={{ color: 'var(--gray)' }}>{title}</h4>
      <div
        className={`flex gap-1 mt-2 mb-4 p-1 rounded-[10px] justify-around ${
          key === "pressure" ? "flex-nowrap" : "flex-wrap"
        }`}
        style={{ backgroundColor: 'var(--bg-2)' }}
      >
        {/* Render buttons for each option */}
        {options.map((option) => {
          // Normalize option for comparison (handle case differences)
          const normalizedOption = option.toLowerCase();
          const normalizedSetting = typeof settings[key] === 'string' ? settings[key].toLowerCase() : settings[key];
          const isSelected = normalizedSetting === normalizedOption;
          
          return (
            <button
              key={option}
              onClick={() => updateSetting(key, normalizedOption)}
              className={`${
                key === "pressure" || key === "windSpeed"
                  ? "w-[32%] text-xs px-2 py-1"
                  : key === "themeStyle"
                  ? "w-[48%] text-xs px-1 py-1.5"
                  : key === "themeMode"
                  ? "w-[32%] text-xs px-2 py-1.5"
                  : "w-[49%] min-w-[10%] px-10 py-1.5 text-sm"
              } text-center rounded-[7px] transition-all shadow-md`}
              style={{
                backgroundColor: isSelected ? 'var(--bg-0)' : 'transparent',
                color: isSelected ? 'var(--fg)' : 'var(--gray)',
              }}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );

  // Function to render a toggle switch
  const renderToggle = (label, key) => (
    <div className="flex items-center justify-between mt-4">
      <span className="text-sm" style={{ color: 'var(--fg)' }}>{label}</span>
      <label className="inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={settings[key]}
          onChange={() => handleDarkModeToggle(key)} // Use the updated handler here
          className="sr-only"
        />
        {/* Toggle switch */}
        <div className="w-10 h-5 rounded-full relative transition-all" style={{ backgroundColor: settings[key] ? 'var(--blue)' : 'var(--gray)' }}>
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
      <div className="mt-6 pt-4" style={{ borderTop: '1px solid var(--bg-2)' }}>
        <h4 className="font-semibold mb-2" style={{ color: 'var(--gray)' }}>Notifications</h4>
        {renderToggle("Be aware of the weather", "notifications")}
      </div>

      {/* Theme Selection */}
      <div className="mt-6 pt-4" style={{ borderTop: '1px solid var(--bg-2)' }}>
        <h4 className="font-semibold mb-2" style={{ color: 'var(--gray)' }}>Appearance</h4>
        {renderOptionGroup("Theme Mode", "themeMode", ["Light", "Dark", "System"])}
        {renderOptionGroup("Theme Style", "themeStyle", ["Gruvbox", "Catppuccin", "Monokai", "Flexbox", "Everforest"])}
      </div>

      {/* General settings toggles */}
      <div className="mt-6 pt-4" style={{ borderTop: '1px solid var(--bg-2)' }}>
        <h4 className="font-semibold mb-2" style={{ color: 'var(--gray)' }}>General</h4>
        {renderToggle("12-Hour Time", "timeFormat")}
        {renderToggle("Location", "location")}
      </div>

      {/* AI Features */}
      <div className="mt-6 pt-4" style={{ borderTop: '1px solid var(--bg-2)' }}>
        <h4 className="font-semibold mb-2" style={{ color: 'var(--gray)' }}>
          AI Features
          {settings.aiEnabled && settings.aiApiKey && (
            <span className="ml-2 text-xs" style={{ color: 'var(--green)' }}>● Active</span>
          )}
        </h4>
        {renderToggle("Enable AI Features", "aiEnabled")}
        
        {settings.aiEnabled && (
          <>
            {/* AI Provider Selection */}
            <div className="mt-4">
              <h5 className="font-semibold text-xs mb-2" style={{ color: 'var(--gray)' }}>AI Provider</h5>
              <div className="flex flex-col">
                <div
                  className="flex gap-1 mt-2 mb-4 p-1 rounded-[10px] justify-around flex-wrap"
                  style={{ backgroundColor: 'var(--bg-2)' }}
                >
                  {["OpenAI", "Anthropic", "Google"].map((option) => {
                    const normalizedOption = option === "OpenAI" ? "openai" : option === "Anthropic" ? "anthropic" : "google";
                    const isSelected = settings.aiProvider?.toLowerCase() === normalizedOption;
                    
                    return (
                      <button
                        key={option}
                        onClick={() => updateSetting("aiProvider", normalizedOption)}
                        className="w-[32%] text-xs px-2 py-1.5 text-center rounded-[7px] transition-all shadow-md"
                        style={{
                          backgroundColor: isSelected ? 'var(--bg-0)' : 'transparent',
                          color: isSelected ? 'var(--fg)' : 'var(--gray)',
                        }}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* API Key Input */}
            <div className="mt-4">
              <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--gray)' }}>
                API Key
                {settings.aiEnabled && !settings.aiApiKey && (
                  <span className="ml-1" style={{ color: 'var(--red)' }}>*</span>
                )}
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? "text" : "password"}
                  value={settings.aiApiKey || ""}
                  onChange={(e) => updateSetting("aiApiKey", e.target.value)}
                  placeholder={`Enter your ${settings.aiProvider || 'OpenAI'} API key`}
                  className="w-full px-3 py-2 rounded-lg text-sm"
                  style={{
                    backgroundColor: 'var(--bg-2)',
                    color: 'var(--fg)',
                    border: settings.aiEnabled && !settings.aiApiKey ? '1px solid var(--red)' : '1px solid transparent'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
                  style={{ color: 'var(--gray)' }}
                >
                  {showApiKey ? <IoEyeOff size={18} /> : <IoEye size={18} />}
                </button>
              </div>
              {settings.aiEnabled && !settings.aiApiKey && (
                <p className="text-xs mt-1" style={{ color: 'var(--red)' }}>
                  API key is required to use AI features
                </p>
              )}
              <p className="text-xs mt-1" style={{ color: 'var(--gray)' }}>
                Your API key is stored locally and never shared
              </p>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
