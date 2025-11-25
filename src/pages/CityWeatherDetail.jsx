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

  // Get current time
  const now = new Date();

  // Get raw UNIX sunrise and sunset time
  const sunrise = currentWeatherInfo.sunrise;
  const sunset = currentWeatherInfo.sunset;

  // Determine if it's currently daytime (this logic assumes sunrise/sunset are already Date objects)
  const isDayTime = now >= sunrise && now < sunset;

  // Choose which label/time to display: if it's day, show sunset time; if it's night, show sunrise time
  const displayLabel = isDayTime ? "SUNRISE" : "SUNSET";
  const displayTime = isDayTime ? sunrise : sunset;

  // This array helps organize and iterate over the weather data
  const cityInfo = [
    {
      temperature: convertTemperature(
        currentWeatherInfo.temperature,
        settings.temperature
      ), // Apply temperature setting
      uvIndex: currentWeatherInfo.uvIndex,
      wind: convertWindSpeed(currentWeatherInfo.windSpeed, settings.windSpeed), // Apply wind speed setting
      feelsLike: convertTemperature(
        currentWeatherInfo.feelsLike,
        settings.temperature
      ), // Apply temperature setting for feels like
      pressure: convertPressure(currentWeatherInfo.pressure, settings.pressure), // Apply pressure setting
      humidity: currentWeatherInfo.humidity,
      // visibility: currentWeatherInfo.visibility,
      visibility: convertDistance(
        currentWeatherInfo.visibility / 1000,
        settings.distance
      ),

      sunrise: sunrise,
      sunset: sunset,
      chanceOfRain: currentWeatherInfo.chanceOfRain,
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
    } else if (unit === " miles" && typeof value === "number") {
      displayValue = value.toFixed(1); // Round miles value to 1 decimal place
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
        popValue={currentWeatherInfo.chanceOfRain}
        weatherIcon={iconMap[currentWeatherInfo.weatherIcon]} // map API icon to local icon
        tempValue={Math.floor(currentWeatherInfo.temperature)} // round temp
      />

      {/* Detailed weather info cards */}
      {cityInfo.map((info, infoIndex) => {
        const cards = [
          { title: "UV INDEX", value: info.uvIndex },
          { title: "WIND", value: info.wind, unit: settings.windSpeed },
          { title: "HUMIDITY", value: info.humidity, unit: "%" },
          { title: "VISIBILITY", value: info.visibility, unit: settings.distance === "Miles" ? " miles" : " km" },
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
