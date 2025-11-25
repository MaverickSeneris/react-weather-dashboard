import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card from "../components/ui/Card";
import { useWeatherSettings } from "../utils/hooks/useWeatherSettings";
import { IoEye, IoEyeOff, IoChevronDown } from "react-icons/io5";

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
  const renderOptionGroup = (title, key, options, groupIndex) => (
    <motion.div
      className="flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        damping: 20,
        stiffness: 300,
        delay: groupIndex * 0.1,
      }}
    >
      {/* Group title */}
      <motion.h4
        className="font-semibold mt-1"
        style={{ color: 'var(--gray)' }}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: groupIndex * 0.1 + 0.05 }}
      >
        {title}
      </motion.h4>
      <motion.div
        className={`flex gap-1 mt-2 mb-4 p-1 rounded-[10px] justify-around ${
          key === "pressure" ? "flex-nowrap" : "flex-wrap"
        }`}
        style={{ backgroundColor: 'var(--bg-2)' }}
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.05,
              delayChildren: groupIndex * 0.1 + 0.1,
            },
          },
        }}
      >
        {/* Render buttons for each option */}
        {options.map((option, index) => {
          // Normalize option for comparison (handle case differences and special theme names)
          let normalizedOption = option.toLowerCase();
          // Handle special theme name mapping
          if (option === "Ily❤️") {
            normalizedOption = "ily❤️";
          } else if (option === "Rose Pine") {
            normalizedOption = "rose pine";
          } else if (option === "Tokyo Night") {
            normalizedOption = "tokyo night";
          }
          const normalizedSetting = typeof settings[key] === 'string' ? settings[key].toLowerCase() : settings[key];
          const isSelected = normalizedSetting === normalizedOption;
          
          return (
            <motion.button
              key={option}
              onClick={() => updateSetting(key, normalizedOption)}
              variants={{
                hidden: {
                  opacity: 0,
                  scale: 0.8,
                  y: 10,
                },
                visible: {
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  transition: {
                    type: "spring",
                    damping: 20,
                    stiffness: 300,
                  },
                },
              }}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
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
            </motion.button>
          );
        })}
      </motion.div>
    </motion.div>
  );

  // Theme selector dropdown state
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const themeDropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(event.target)) {
        setIsThemeDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Theme options
  const themeOptions = [
    "Gruvbox",
    "Catppuccin",
    "Monokai",
    "Flexbox",
    "Everforest",
    "Ily❤️",
    "Rose Pine",
    "Nord",
    "Tokyo Night",
    "Solarized",
  ];

  // Function to normalize theme name
  const normalizeThemeName = (themeName) => {
    if (themeName === "Ily❤️") return "ily❤️";
    if (themeName === "Rose Pine") return "rose pine";
    if (themeName === "Tokyo Night") return "tokyo night";
    return themeName.toLowerCase();
  };

  // Function to get display name from normalized name
  const getDisplayName = (normalized) => {
    if (normalized === "ily❤️") return "Ily❤️";
    if (normalized === "rose pine") return "Rose Pine";
    if (normalized === "tokyo night") return "Tokyo Night";
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
  };

  // Function to render theme selector dropdown
  const renderThemeSelector = (groupIndex) => {
    const currentTheme = settings.themeStyle || "catppuccin";
    const normalizedCurrent = typeof currentTheme === 'string' ? currentTheme.toLowerCase() : currentTheme;
    const displayName = getDisplayName(normalizedCurrent);

    return (
      <motion.div
        className="flex flex-col"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 300,
          delay: groupIndex * 0.1,
        }}
        ref={themeDropdownRef}
      >
        <motion.h4
          className="font-semibold mt-1 mb-2"
          style={{ color: 'var(--gray)' }}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: groupIndex * 0.1 + 0.05 }}
        >
          Theme Style
        </motion.h4>
        <div className="relative">
          <motion.button
            onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
            className="w-full flex items-center justify-between p-3 rounded-[10px] text-left"
            style={{ 
              backgroundColor: 'var(--bg-2)',
              color: 'var(--fg)',
            }}
            whileHover={{ backgroundColor: 'var(--bg-1)' }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <span className="text-sm font-medium">{displayName}</span>
            <motion.div
              animate={{ rotate: isThemeDropdownOpen ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <IoChevronDown size={18} style={{ color: 'var(--gray)' }} />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {isThemeDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="absolute z-50 w-full mt-2 rounded-[10px] overflow-hidden shadow-lg"
                style={{ 
                  backgroundColor: 'var(--bg-2)',
                  border: '1px solid var(--bg-1)',
                }}
              >
                <div className="max-h-64 overflow-y-auto">
                  {themeOptions.map((theme, index) => {
                    const normalized = normalizeThemeName(theme);
                    const isSelected = normalizedCurrent === normalized;
                    
                    return (
                      <motion.button
                        key={theme}
                        onClick={() => {
                          updateSetting("themeStyle", normalized);
                          setIsThemeDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm transition-colors"
                        style={{
                          backgroundColor: isSelected ? 'var(--bg-0)' : 'transparent',
                          color: isSelected ? 'var(--fg)' : 'var(--gray)',
                        }}
                        whileHover={{
                          backgroundColor: isSelected ? 'var(--bg-0)' : 'var(--bg-1)',
                          color: 'var(--fg)',
                        }}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        {theme}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  };

  // Function to render a toggle switch
  const renderToggle = (label, key, toggleIndex) => (
    <motion.div
      className="flex items-center justify-between mt-4"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        type: "spring",
        damping: 20,
        stiffness: 300,
        delay: toggleIndex * 0.08,
      }}
    >
      <span className="text-sm" style={{ color: 'var(--fg)' }}>{label}</span>
      <motion.label
        className="inline-flex items-center cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <input
          type="checkbox"
          checked={settings[key]}
          onChange={() => handleDarkModeToggle(key)} // Use the updated handler here
          className="sr-only"
        />
        {/* Toggle switch */}
        <motion.div
          className="w-10 h-5 rounded-full relative"
          style={{ backgroundColor: settings[key] ? 'var(--blue)' : 'var(--gray)' }}
          animate={{
            backgroundColor: settings[key] ? 'var(--blue)' : 'var(--gray)',
          }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full"
            animate={{
              x: settings[key] ? 20 : 0,
            }}
            transition={{
              type: "spring",
              damping: 20,
              stiffness: 300,
            }}
          ></motion.div>
        </motion.div>
      </motion.label>
    </motion.div>
  );

  return (
    <Card>
      {/* Render option groups */}
      {renderOptionGroup("Temperature", "temperature", [
        "Celsius",
        "Fahrenheit",
      ], 0)}
      {renderOptionGroup("Wind Speed", "windSpeed", ["km/h", "m/s", "Knots"], 1)}
      {renderOptionGroup("Pressure", "pressure", [
        "hPa",
        "Inches",
        "kPa",
        "mm",
      ], 2)}
      {renderOptionGroup("Precipitation", "precipitation", [
        "Millimeters",
        "Inches",
      ], 3)}
      {renderOptionGroup("Distance", "distance", ["Kilometers", "Miles"], 4)}

      {/* Notifications toggle */}
      <motion.div
        className="mt-6 pt-4"
        style={{ borderTop: '1px solid var(--bg-2)' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 300,
          delay: 0.5,
        }}
      >
        <motion.h4
          className="font-semibold mb-2"
          style={{ color: 'var(--gray)' }}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.55 }}
        >
          Notifications
        </motion.h4>
        {renderToggle("Be aware of the weather", "notifications", 0)}
      </motion.div>

      {/* Theme Selection */}
      <motion.div
        className="mt-6 pt-4"
        style={{ borderTop: '1px solid var(--bg-2)' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 300,
          delay: 0.6,
        }}
      >
        <motion.h4
          className="font-semibold mb-2"
          style={{ color: 'var(--gray)' }}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.65 }}
        >
          Appearance
        </motion.h4>
        {renderOptionGroup("Theme Mode", "themeMode", ["Light", "Dark", "System"], 5)}
        {renderThemeSelector(6)}
      </motion.div>

      {/* General settings toggles */}
      <motion.div
        className="mt-6 pt-4"
        style={{ borderTop: '1px solid var(--bg-2)' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 300,
          delay: 0.7,
        }}
      >
        <motion.h4
          className="font-semibold mb-2"
          style={{ color: 'var(--gray)' }}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.75 }}
        >
          General
        </motion.h4>
        {renderToggle("12-Hour Time", "timeFormat", 1)}
        {renderToggle("Location", "location", 2)}
      </motion.div>

      {/* AI Features */}
      <motion.div
        className="mt-6 pt-4"
        style={{ borderTop: '1px solid var(--bg-2)' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 300,
          delay: 0.8,
        }}
      >
        <motion.h4
          className="font-semibold mb-2"
          style={{ color: 'var(--gray)' }}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.85 }}
        >
          AI Features
          {settings.aiEnabled && settings.aiApiKey && (
            <motion.span
              className="ml-2 text-sm"
              style={{ color: 'var(--green)' }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: "spring",
                damping: 15,
                stiffness: 200,
                delay: 0.9,
              }}
            >
              ● Active
            </motion.span>
          )}
        </motion.h4>
        {renderToggle("Enable AI Features", "aiEnabled", 3)}
        
        {settings.aiEnabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{
              type: "spring",
              damping: 20,
              stiffness: 300,
              delay: 0.9,
            }}
          >
            {/* AI Provider Selection */}
            <motion.div
              className="mt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.95 }}
            >
              <h5 className="font-semibold mb-2" style={{ color: 'var(--gray)' }}>AI Provider</h5>
              <div className="flex flex-col">
                <motion.div
                  className="flex gap-1 mt-2 mb-4 p-1 rounded-[10px] justify-around flex-wrap"
                  style={{ backgroundColor: 'var(--bg-2)' }}
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.08,
                        delayChildren: 1.0,
                      },
                    },
                  }}
                >
                  {["OpenAI", "Anthropic", "Google"].map((option) => {
                    const normalizedOption = option === "OpenAI" ? "openai" : option === "Anthropic" ? "anthropic" : "google";
                    const isSelected = settings.aiProvider?.toLowerCase() === normalizedOption;
                    
                    return (
                      <motion.button
                        key={option}
                        onClick={() => updateSetting("aiProvider", normalizedOption)}
                        variants={{
                          hidden: {
                            opacity: 0,
                            scale: 0.8,
                            y: 10,
                          },
                          visible: {
                            opacity: 1,
                            scale: 1,
                            y: 0,
                            transition: {
                              type: "spring",
                              damping: 20,
                              stiffness: 300,
                            },
                          },
                        }}
                        whileHover={{ scale: 1.05, y: -1 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-[32%] text-xs px-2 py-1.5 text-center rounded-[7px] transition-all shadow-md"
                        style={{
                          backgroundColor: isSelected ? 'var(--bg-0)' : 'transparent',
                          color: isSelected ? 'var(--fg)' : 'var(--gray)',
                        }}
                      >
                        {option}
                      </motion.button>
                    );
                  })}
                </motion.div>
              </div>
            </motion.div>

            {/* API Key Input */}
            <motion.div
              className="mt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.05 }}
            >
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--gray)' }}>
                API Key
                {settings.aiEnabled && !settings.aiApiKey && (
                  <span className="ml-1" style={{ color: 'var(--red)' }}>*</span>
                )}
              </label>
              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1 }}
              >
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
                <motion.button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
                  style={{ color: 'var(--gray)' }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showApiKey ? <IoEyeOff size={18} /> : <IoEye size={18} />}
                </motion.button>
              </motion.div>
              {settings.aiEnabled && !settings.aiApiKey && (
                <motion.p
                  className="text-xs mt-1"
                  style={{ color: 'var(--red)' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.15 }}
                >
                  API key is required to use AI features
                </motion.p>
              )}
              <motion.p
                className="text-xs mt-1"
                style={{ color: 'var(--gray)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                Your API key is stored locally and never shared
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </Card>
  );
}
