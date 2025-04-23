import React, { useState, useEffect } from "react";
import Card from "../components/Card";
import axios from "axios";
import iconMap from "../utils/weatherIconMapper"; // Maps weather codes to local SVG icons
import formatTime from "../utils/timeFormatter"; // Utility function to format time
import getDayLabel from "../utils/dayLabel";
import chanceOfRainIcon from "../assets/weather-icons/chance-of-rain.svg"
import temperatureIcon from "../assets/weather-icons/temperature.svg";
import windIcon from "../assets/weather-icons/wind.svg";
import uviIcon from "../assets/weather-icons/uv-index.svg";
import CurrentCityContainer from "../components/CurrentCityContainer";
import CardTitle from "../components/CardTitle";
import HourlyContainer from "../components/HourlyContainer";


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
    feelsLike: 0,
    uvIndex: 0,
    windSpeed: 0,
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
              feelsLike: weatherData.current.feels_like || 0,
              uvIndex: weatherData.current.uvi || 0,
              windSpeed: weatherData.current.wind_speed || 0,
              chanceOfRain: weatherData.daily?.[0]?.pop ?? 0,
            });

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
    <div className="flex flex-col items-center w-100 px-4 mt-10 pb-2">
      <CurrentCityContainer
        cityName={currentLocation.village}
        popValue={Math.round(currentWeatherInfo.chanceOfRain * 100)}
        weatherIcon={currentWeatherIcon}
        tempValue={Math.floor(currentWeatherInfo.temperature)}
      />

      {/* Hourly Weather Forecast */}
      <Card>
       <CardTitle title={"TODAY'S FORECAST"}/>
          <HourlyContainer hourlyWeatherInfo={hourlyWeatherInfo}/>
      </Card>
      <Card>
        <div className="space-y-3">
          <CardTitle title={"7-DAY FORECAST"} />
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
      {/* Current Weather Details */}
      <Card>
        <CardTitle title={"CURRENT CONDITION"} />
        <div className="grid grid-cols-2 mt-2">
          <div className="pb-4">
            <div className="flex items-center gap-1">
              <img src={temperatureIcon} className="w-6 invert-70" />
              <p className="font-semibold text-gray-400">Real Feel</p>
            </div>
            <span className="pl-7 font-bold text-gray-300">
              {Math.floor(currentWeatherInfo.feelsLike)}&deg;
            </span>
          </div>
          <div className="pb-4 ml-4">
            <div className="flex items-center gap-1">
              <img src={windIcon} className="w-6 invert-70" />
              <p className="font-semibold text-gray-400">Wind</p>
            </div>
            <span className="pl-7 font-bold text-gray-300">
              {currentWeatherInfo.windSpeed} km/h
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <img src={chanceOfRainIcon} className="w-6 invert-70" />
              <p className="font-semibold text-gray-400">Chance of Rain</p>
            </div>
            <span className="pl-7 font-bold text-gray-300">
              {Math.floor(currentWeatherInfo.chanceOfRain * 100)}%
            </span>
          </div>
          <div className="ml-4">
            <div className="flex items-center gap-1">
              <img src={uviIcon} className="w-6 invert-70" />
              <p className="font-semibold text-gray-400">UV index</p>
            </div>
            <span className="pl-7 font-bold text-gray-300">
              {currentWeatherInfo.uvIndex}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default CurrentCity;
