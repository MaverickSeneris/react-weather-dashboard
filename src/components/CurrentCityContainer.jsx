import React from "react";
import { motion } from "framer-motion";
import { useWeatherSettings } from "../utils/hooks/useWeatherSettings";

function CurrentCityContainer({ cityName, popValue, weatherIcon, tempValue }) {
  const { settings } = useWeatherSettings();

  const convertTemperature = (value) => {
    if (settings.temperature === "Fahrenheit") {
      return Math.round((value * 9) / 5 + 32);
    }
    return Math.round(value); // Celsius by default
  };

  const displayedTemp = convertTemperature(tempValue);

  return (
    <div className="flex flex-col justify-center items-center">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300, delay: 0.1 }}
        className="font-extrabold text-4xl my-2"
      >
        {cityName}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", damping: 20, stiffness: 300, delay: 0.2 }}
        className="text-lg font-semibold word-space" 
        style={{ color: 'var(--gray)' }}
      >
        Chance of rain: {popValue}%
      </motion.p>

      <motion.img
        src={weatherIcon}
        className="my-6 w-50 pl-4"
        initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ 
          type: "spring", 
          damping: 15, 
          stiffness: 200, 
          delay: 0.3,
          duration: 0.8
        }}
        whileHover={{ 
          scale: 1.1,
          rotate: [0, -10, 10, -10, 0],
          transition: { duration: 0.5 }
        }}
      />

      <motion.h2
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.4 }}
        className="text-5xl font-bold mb-8"
      >
        {displayedTemp}&deg;{settings.temperature === "Fahrenheit" ? "F" : "C"}
      </motion.h2>
    </div>
  );
}

export default CurrentCityContainer;
