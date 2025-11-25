import React from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router";
import CurrentCityContainer from "../components/CurrentCityContainer";
import iconMap from "../utils/weatherIconMapper";
import { BiChevronLeft } from "react-icons/bi";
import Card from "../components/ui/Card";
import formatTime from "../utils/timeFormatter"; // Helper function to convert raw UNIX sunrise and sunset time
import CardTitle from "../components/ui/CardTitle";
import { useWeatherSettings } from "../utils/hooks/useWeatherSettings"; // Import the hook
import { convertTemperature, convertWindSpeed, convertPressure, convertDistance } from "../utils/unitConverter"; // Import the unit converters

function CityWeatherDetail() {
  // Accessing route state (data passed from previous route)
  const { state } = useLocation();
  const { currentWeatherInfo, cityName } = state || {};
  const navigate = useNavigate(); // for going back to previous page

  // Use weather settings
  const { settings } = useWeatherSettings();

  // Handle both nested (currentWeatherInfo.current) and flat structures
  const current = currentWeatherInfo?.current || currentWeatherInfo;

  // Get current time in Unix timestamp (seconds)
  const now = Math.floor(Date.now() / 1000);

  // Get today's sunrise and sunset from current weather (Unix timestamps in seconds)
  const todaySunrise = current?.sunrise || 0;
  const todaySunset = current?.sunset || 0;

  // Get tomorrow's sunrise and sunset from daily forecast (if available)
  const dailyForecast = currentWeatherInfo?.daily || [];
  const tomorrowData = dailyForecast.length > 1 ? dailyForecast[1] : null;
  const tomorrowSunrise = tomorrowData?.sunrise || todaySunrise;
  const tomorrowSunset = tomorrowData?.sunset || todaySunset;

  // Determine what to display based on current time:
  // 1. If before today's sunrise → show today's sunrise
  // 2. If after today's sunrise but before today's sunset → show today's sunset
  // 3. If after today's sunset → show tomorrow's sunrise
  let displayLabel;
  let displayTime;

  if (now < todaySunrise) {
    // Before sunrise: show today's sunrise
    displayLabel = "SUNRISE";
    displayTime = todaySunrise;
  } else if (now >= todaySunrise && now < todaySunset) {
    // After sunrise, before sunset: show today's sunset
    displayLabel = "SUNSET";
    displayTime = todaySunset;
  } else {
    // After sunset: show tomorrow's sunrise
    displayLabel = "SUNRISE";
    displayTime = tomorrowSunrise;
  }

  // This array helps organize and iterate over the weather data
  const cityInfo = [
    {
      temperature: convertTemperature(
        current?.temperature || 0,
        settings.temperature
      ), // Apply temperature setting
      uvIndex: current?.uvIndex || 0,
      wind: convertWindSpeed(current?.windSpeed || 0, settings.windSpeed), // Apply wind speed setting
      feelsLike: convertTemperature(
        current?.feelsLike || 0,
        settings.temperature
      ), // Apply temperature setting for feels like
      pressure: convertPressure(current?.pressure || 0, settings.pressure), // Apply pressure setting
      humidity: current?.humidity || 0,
      visibility: (() => {
        const visibilityKm = (current?.visibility || 0) / 1000;
        const converted = convertDistance(visibilityKm, settings.distance);
        // Round to 1 decimal place for better display
        return Math.round(converted * 10) / 10;
      })(),
      chanceOfRain: current?.chanceOfRain || 0,
    },
  ];

  // Component to format and display the value with optional units
  // const ValueContainer = ({ value, unit }) => (
  //   <span className="font-bold text-[1.4rem] text-gray-300">
  //     {value}
  //     {unit}
  //   </span>
  // );

  //  const ValueContainer = ({ value, unit }) => (
  //    <span className="font-bold text-[1.4rem] text-gray-300">
  //      {typeof value === "number" ? value.toFixed(1) : value}{" "}
  //      {/* Round to 1 decimal place if it's a number */}
  //      {unit}
  //    </span>
  //  );
  //  const ValueContainer = ({ value, unit }) => (
  //    <span className="font-bold text-[1.4rem] text-gray-300">
  //      {unit === " miles" && typeof value === "number"
  //        ? value.toFixed(1)
  //        : value}
  //      {unit}
  //    </span>
  //  );
  // Component to format and display the value with optional units
  const ValueContainer = ({ value, unit }) => {
    let displayValue = value;
    let displayUnit = unit;

    if (unit === settings.pressure && typeof value === "number") {
      displayValue = value.toFixed(0); // Round pressure to 0 decimal places (whole number)
      displayUnit = ` ${unit}`;
    } else if (unit === settings.windSpeed) {
      displayUnit = ` ${unit}`;
    } else if ((unit === " miles" || unit === " km") && typeof value === "number") {
      // Round visibility to 1 decimal place for both miles and km
      displayValue = value.toFixed(1);
    }

    return (
      <span className="font-bold text-[1.4rem]" style={{ color: 'var(--fg)' }}>
        {displayValue}
        {displayUnit}
      </span>
    );
  };

  return (
    <div className="flex flex-col items-center w-screen px-4 mt-5 pb-2">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="self-start font-medium mb-4"
        style={{ color: 'var(--fg)' }}
        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--blue)'}
        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--fg)'}
      >
        <BiChevronLeft className="w-8 h-8 mr-1" />
      </button>

      {/* Top current weather display */}
      <CurrentCityContainer
        cityName={cityName}
        popValue={current?.chanceOfRain || 0}
        weatherIcon={iconMap[current?.weatherIcon || ""]} // map API icon to local icon
        tempValue={Math.floor(current?.temperature || 0)} // round temp
      />

      {/* Detailed weather info cards */}
      {cityInfo.map((info, infoIndex) => {
        const cards = [
          { title: "UV INDEX", value: info.uvIndex },
          { title: "WIND", value: info.wind, unit: settings.windSpeed },
          { title: "HUMIDITY", value: info.humidity, unit: "%" },
          { title: "VISIBILITY", value: info.visibility, unit: settings.distance?.toLowerCase() === "miles" ? " miles" : " km" },
          { title: "FEELS LIKE", value: info.feelsLike, unit: "°" },
          { title: "CHANCE OF RAIN", value: info.chanceOfRain, unit: "%" },
          { title: "PRESSURE", value: info.pressure, unit: settings.pressure },
          { title: displayLabel, value: formatTime(displayTime, settings.timeFormat) },
        ];

        return (
          <motion.div
            key={infoIndex}
            className="grid grid-cols-2 mt-2 w-[100%] gap-x-4"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.08,
                  delayChildren: 0.1,
                },
              },
            }}
          >
            {cards.map((card, cardIndex) => {
              const isEven = cardIndex % 2 === 0;
              return (
                <motion.div
                  key={cardIndex}
                  variants={{
                    hidden: {
                      opacity: 0,
                      x: isEven ? -50 : 50,
                      y: 20,
                      scale: 0.9,
                    },
                    visible: {
                      opacity: 1,
                      x: 0,
                      y: 0,
                      scale: 1,
                      transition: {
                        type: "spring",
                        damping: 20,
                        stiffness: 300,
                      },
                    },
                  }}
                  whileHover={{
                    scale: 1.03,
                    y: -2,
                    transition: { duration: 0.2 },
                  }}
                >
          <Card>
                    <CardTitle title={card.title} />
                    <ValueContainer value={card.value} unit={card.unit} />
          </Card>
                </motion.div>
              );
            })}
          </motion.div>
        );
      })}
    </div>
  );
}

export default CityWeatherDetail;
