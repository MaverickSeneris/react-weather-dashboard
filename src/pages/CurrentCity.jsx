import React, { useState, useEffect } from "react";
import Card from "../components/Card";
import axios from "axios";
import iconMap from "../utils/weatherIconMapper"; // Maps weather codes to local SVG icons
import formatTime from "../utils/timeFormatter"; // Utility function to format time
import getDayLabel from "../utils/dayLabel";

function CurrentCity() {
  const [currentLocation, setCurrentLocation] = useState({
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
    uvIndex: "",
    windSpeed: "",
    chanceOfRain: 0,
  });

  const [hourlyWeatherInfo, setHourlyWeatherInfo] = useState({
    time: [],
    temperature: [],
    icon: [],
  });

  const [dailyWeatherInfo, setDailyWeatherInfo] = useState([]);

  const [unit, setUnit] = useState("metric"); // Set default unit to 'metric'

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
            setCurrentLocation({
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
              uvIndex: weatherData.current.uvi || "",
              windSpeed: weatherData.wind_speed || "",
              chanceOfRain: weatherData.daily?.[0]?.pop ?? 0,
            });

            // // Set chance of rain for the day (0\u20131 scale, represents probability of precipitation)
            // setDailyWeatherInfo({
            //   chanceOfRain: weatherData.daily?.[0]?.pop ?? 0,
            // });

            // Get weather data every 3 hours only (e.g., 12AM, 3AM, 6AM...) for cleaner hourly forecast
            const hourlyData = weatherData.hourly
              .filter((_, index) => index >= 2 && (index - 2) % 3 === 0) // starts at 3rd and gets every 3rd
              .slice(0, 3) // get first 3 from that selection
              .map((data) => ({
                time: formatTime(data.dt),
                temperature: data.temp,
                icon: data.weather?.[0]?.icon,
              }));

            setHourlyWeatherInfo({
              time: hourlyData.map((item) => item.time),
              temperature: hourlyData.map((item) => item.temperature),
              icon: hourlyData.map((item) => item.icon),
            });

            const dailyData = weatherData.daily
              .slice(0, 7)
              .map((data, index) => ({
                day: getDayLabel(data.dt, index),
                icon: data.weather[0]?.icon || "",
                description: data.weather[0]?.description || "",
                tempHigh: Math.round(data.temp.max),
                tempLow: Math.round(data.temp.min),
              }));

            setDailyWeatherInfo(dailyData);
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

  // Map current weather icon code to local icon (SVG)
  const currentWeatherIcon = iconMap[currentWeatherInfo.weatherIcon];

  return (
    <div className="flex flex-col items-center w-100 h-100 px-4 mt-16">
      {/* Display current city name */}
      <span className="font-extrabold text-4xl my-2">
        {currentLocation.village}
      </span>
      <p className="text-lg font-semibold text-gray-400 word-space">
        Chance of rain: {Math.round(currentWeatherInfo.chanceOfRain * 100)}%
      </p>
      {/* <p className="text-xs">{currentWeatherInfo.description}</p> */}
      {/* <p className="text-xs">
        Feels like: {Math.floor(currentWeatherInfo.feelsLike)}&deg;
      </p> */}

      {/* Current weather icon */}
      <img src={currentWeatherIcon} className="my-6 w-50 pl-4" />
      <p className="text-5xl font-bold mb-8">
        {Math.floor(currentWeatherInfo.temperature)}&deg;
      </p>

      {/* Hourly Weather Forecast */}
      <Card>
        <p className="text-xs font-bold text-gray-300 pb-2">TODAY'S FORECAST</p>
        <div className={`flex flex-col my-2 items-center w-[100%]`}>
          <div className="w-[100%] flex justify-between">
            {hourlyWeatherInfo.time.map((time, index) => {
              return (
                <span
                  key={index}
                  className="w-max font-bold pb-2 text-gray-400"
                >
                  {time}
                </span>
              );
            })}
          </div>
          <div className="w-[100%] flex justify-between">
            {hourlyWeatherInfo.icon.map((icon, index) => {
              return (
                <img
                  className="w-16"
                  key={index}
                  src={iconMap[icon]}
                  alt="weather icon"
                />
              );
            })}
          </div>
          <div className="w-[88%] flex justify-between">
            {hourlyWeatherInfo.temperature.map((temp, index) => {
              return (
                <span key={index} className="font-extrabold text-xl">
                  {Math.floor(temp)}&deg;
                </span>
              );
            })}
          </div>
        </div>
      </Card>
      <Card>
        <div className="space-y-3">
          <p className="text-xs font-bold text-gray-300 pb-2">7-DAY FORECAST</p>
          {dailyWeatherInfo.map((day, index) => (
            <div
              key={index}
              className="flex items-center justify-around text-sm"
            >
              <span className="w-12 font-semibold text-lg text-gray-400">
                {day.day}
              </span>
              <div className="flex items-center">
                <img
                  src={iconMap[day.icon]}
                  alt={day.description}
                  className="w-10"
                />
                <span className="pl-2 capitalize font-bold text-[0.8rem] text-gray-300 w-32">
                  {day.description}
                </span>
              </div>
              <div>
                <span className="font-bold text-lg">{day.tempHigh}</span>
                <span className="text-gray-400 text-lg">/{day.tempLow}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <p className="text-xs font-bold text-gray-300 pb-2">AIR CONDITION</p>
        <div className="grid grid-cols-2">
          <div className="pb-4">
            <div>
              <img src={""} />
              <p className="font-semibold text-gray-400">Real Feel</p>
            </div>
            <span className="pl-2 font-bold text-gray-300">
              {Math.floor(currentWeatherInfo.feelsLike)}&deg;
            </span>
          </div>

          <div className="pb-4">
            <div>
              <img src={""} />
              <p className="font-semibold text-gray-400">Wind</p>
            </div>
            <span className="pl-2 font-bold text-gray-300">
              {Math.floor(currentWeatherInfo.feelsLike)}&deg;
            </span>
          </div>
          <div className="pb-4">
            <div>
              <img src={""} />
              <p className="font-semibold text-gray-400">Chance of Rain</p>
            </div>
            <span className="pl-2 font-bold text-gray-300">
              {Math.floor(currentWeatherInfo.feelsLike)}&deg;
            </span>
          </div>
          <div className="pb-4">
            <div>
              <img src={""} />
              <p className="font-semibold text-gray-400">UV index</p>
            </div>
            <span className="pl-2 font-bold text-gray-300">
              {Math.floor(currentWeatherInfo.feelsLike)}&deg;
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default CurrentCity;
