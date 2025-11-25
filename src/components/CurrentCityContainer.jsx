import React from "react";
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
      <h1 className="font-extrabold text-4xl my-2">{cityName}</h1>

      <p className="text-lg font-semibold word-space" style={{ color: 'var(--gray)' }}>
        Chance of rain: {popValue}%
      </p>

      <img src={weatherIcon} className="my-6 w-50 pl-4" />

      <h2 className="text-5xl font-bold mb-8">
        {displayedTemp}&deg;{settings.temperature === "Fahrenheit" ? "F" : "C"}
      </h2>
    </div>
  );
}

export default CurrentCityContainer;
