import React, { useState, useEffect } from "react";
import sunny from "../assets/weather-icons/02_clear.svg"; // sunny icon for display
import Card from "../components/Card";
import hourly from "../seed-data/hourlyseed"; // Sample hourly data for rendering (you may replace this with actual API data)

import axios from "axios";
import iconMap from "../utils/weatherIconMapper"; // Maps weather codes to local SVG icons
import formatTime from "../utils/timeFormatter"; // Utility function to format time

function CurrentCity() {
  const [cityInfo, setCityInfo] = useState({
    town: "",
    state: "",
    country: "",
    village: "",
    region: "",
  });

  const [currentWeatherInfo, setCurrentWeatherInfo] = useState({
    temperature: "",
    weatherIcon: "",
    description: "",
    feelsLike: "",
  });

  const [hourlyWeatherInfo, setHourlyWeatherInfo] = useState({
    time: [],
    temperature: [],
    icon: [],
  });

  const [dailyWeatherInfo, setDailyWeatherInfo] = useState({
    chanceOfRain: 0,
  });

  const [unit, setUnit] = useState("metric"); // Set default unit to 'metric' for �C

  useEffect(() => {
    const weatherApiUrl = import.meta.env.VITE_OPENWEATHER_ONECALL_API_URL;
    const weatherApiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
    const geoLocationApiKey = import.meta.env.VITE_OPENCAGE_API_KEY;

    // Get current location coordinates (latitude and longitude) from the browser's geolocation API
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Fetch city information based on the current latitude and longitude (Geo-location API)
        axios
          .get(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${geoLocationApiKey}`
          )
          .then((response) => {
            const components = response.data.results[0].components;

            // Set city info based on the response from the geolocation API
            setCityInfo({
              town: components.town || "",
              state: components.state || "",
              country: components.country || "",
              village: components.village || "",
              region: components.region || "",
            });
          })
          .catch((err) => {
            console.error("Failed to fetch location:", err);
          });

        // Fetch weather data based on latitude and longitude (Weather API)
        axios
          .get(
            `${weatherApiUrl}lat=${latitude}&lon=${longitude}&appid=${weatherApiKey}&units=${unit}`
          )
          .then((response) => {
            const weatherData = response.data;

            // Set current weather details: temperature, weather description, icon, and feels-like temperature
            setCurrentWeatherInfo({
              temperature: weatherData.current.temp || "",
              weatherIcon: weatherData.current.weather[0].icon || "",
              description: weatherData.current.weather[0].description || "",
              feelsLike: weatherData.current.feels_like || "",
            });

            // Set chance of rain for the day (0\u20131 scale, represents probability of precipitation)
            setDailyWeatherInfo({
              chanceOfRain: weatherData.daily?.[0]?.pop ?? 0,
            });

            // Process hourly weather forecast data (mapped into simpler objects for rendering)
            const hourlyData = weatherData.hourly.map((data) => ({
              time: formatTime(data.dt) || "", // Format timestamp into readable time
              temperature: data.temp || "", // Temperature in �C (or according to selected unit)
              icon: data.weather?.[0]?.icon || "", // Weather condition icon code
            }));

            // Extract separate arrays for time, temperature, and icon to update the state
            setHourlyWeatherInfo({
              time: hourlyData.map((item) => item.time),
              temperature: hourlyData.map((item) => item.temperature),
              icon: hourlyData.map((item) => item.icon),
            });
          })
          .catch((error) => {
            console.error(error);
          });
      },
      (error) => {
        console.error("Location error:", error.message); // Handle geolocation errors
      }
    );
  }, [unit]); // Re-run effect if 'unit' state changes

  // Map weather icon code to local icon (SVG)
  const currentWeatherIcon = iconMap[currentWeatherInfo.weatherIcon];

  return (
    <div className="flex flex-col items-center w-100 h-100 px-8 mt-16">
      {/* Display current city name */}
      <span className="font-extrabold text-4xl my-2">{cityInfo.village}</span>
      <p className="text-s">
        Chance of rain: {Math.round(dailyWeatherInfo.chanceOfRain * 100)}%
      </p>
      <p className="text-xs">{currentWeatherInfo.description}</p>
      <p className="text-xs">
        Feels like: {Math.floor(currentWeatherInfo.feelsLike)}&deg;
      </p>

      {/* Current weather icon */}
      <img src={currentWeatherIcon} className="my-6 w-50 pl-4" />
      <p className="text-5xl font-bold mb-8">
        {Math.floor(currentWeatherInfo.temperature)}&deg;
      </p>

      {/* Hourly Weather Forecast */}
      <Card>
        <p className="text-sm font-semibold text-gray-300">Today's Forecast</p>
        <div className="flex gap-4 my-2 justify-around items-center w-[100%]">
          {/* Loop through hourly weather data and display each hour's weather */}
          {hourly.map((data, index) => {
            return (
              <div
                key={index}
                className={`flex flex-col justify-between items-center px-3 py-2 ${
                  index === 1 ? "border-x border-gray-500" : ""
                }`}
              >
                <span className="font-semibold pb-2 text-gray-300">
                  {data.time}
                </span>
                {data.weather === "sunny" && (
                  <img src={sunny} className="w-18 pl-1.5" />
                )}
                <span className="font-bold text-gray-300">
                  {data.temperature}&deg;
                </span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

export default CurrentCity;
