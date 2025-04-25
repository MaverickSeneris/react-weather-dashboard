import React, { useState, useEffect } from "react";
import axios from "axios";
import iconMap from "../utils/weatherIconMapper"; // Maps weather codes to local SVG icons
import formatTime from "../utils/timeFormatter"; // Utility function to format time
import getDayLabel from "../utils/dayLabel"; // Utility function to format day
import CurrentCityContainer from "../components/CurrentCityContainer";
import HourlyContainer from "../components/HourlyContainer";
import DailyContainer from "../components/DailyContainer";
import CurrentWeatherContainer from "../components/CurrentWeatherContainer";

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
    // Gets user's location on component mount or when unit changes (metric/imperial)
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        console.log("coordinates:", latitude, longitude)
        fetchLocation(latitude, longitude); // Fetch city/village/etc. info
        fetchWeather(latitude, longitude); // Fetch current, hourly, and daily weather
      },
      (error) => {
        console.error("Geolocation error:", error.message);
      }
    );
  }, [unit]);

  // Fetch location details from OpenCage API using latitude and longitude
  const fetchLocation = async (lat, lon) => {
    try {
      const geoKey = import.meta.env.VITE_OPENCAGE_API_KEY;
      const res = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${geoKey}`
      );
      const c = res.data.results[0].components;

      setCurrentLocation({
        town: c.town || "",
        state: c.state || "",
        country: c.country || "",
        village: c.village || "",
        region: c.region || "",
      });
    } catch (err) {
      console.error(
        "❌ Error in [CurrentCity.jsx > fetchLocation()] — possibly at line 51",
        err
      );
    }
  };

  // Fetch weather data from OpenWeather API using latitude and longitude
  const fetchWeather = async (lat, lon) => {
    try {
      const url = import.meta.env.VITE_OPENWEATHER_ONECALL_API_URL;
      const key = import.meta.env.VITE_OPENWEATHER_API_KEY;

      const res = await axios.get(
        `${url}lat=${lat}&lon=${lon}&appid=${key}&units=${unit}`
      );
      const data = res.data;

      setCurrentWeatherInfo({
        temperature: data.current.temp || "",
        weatherIcon: data.current.weather[0]?.icon || "",
        description: data.current.weather[0]?.description || "",
        feelsLike: data.current.feels_like || 0,
        uvIndex: data.current.uvi || 0,
        windSpeed: data.current.wind_speed || 0,
        chanceOfRain: data.daily?.[0]?.pop ?? 0,
        pressure: data.current.pressure || "",
        visibility: data.current.visibility || "",
        humidity: data.current.humidity || "",
        sunset: data.current.sunset || "",
        sunrise: data.current.sunrise || "",
      });

      const hourlyData = data.hourly
        .filter((_, i) => i >= 2 && (i - 2) % 3 === 0)
        .slice(0, 3)
        .map((d) => ({
          time: formatTime(d.dt),
          temperature: d.temp,
          icon: d.weather?.[0]?.icon,
        }));

      setHourlyWeatherInfo({
        time: hourlyData.map((i) => i.time),
        temperature: hourlyData.map((i) => i.temperature),
        icon: hourlyData.map((i) => i.icon),
      });

      const dailyData = data.daily.slice(0, 7).map((d, i) => ({
        day: getDayLabel(d.dt, i),
        icon: d.weather[0]?.icon || "",
        description: d.weather[0]?.description || "",
        tempHigh: Math.round(d.temp.max),
        tempLow: Math.round(d.temp.min),
      }));

      setDailyWeatherInfo(dailyData);
    } catch (err) {
      console.error(
        "❌ Error in [CurrentCity.jsx > fetchWeather()] — possibly at line 75",
        err
      );
    }
  };

  return (
    <div className="flex flex-col items-center w-screen px-4 mt-10 pb-2">
      <CurrentCityContainer
        cityName={currentLocation.village}
        popValue={Math.round(currentWeatherInfo.chanceOfRain * 100)}
        weatherIcon={iconMap[currentWeatherInfo.weatherIcon]}
        tempValue={Math.floor(currentWeatherInfo.temperature)}
      />
      <HourlyContainer hourlyWeatherInfo={hourlyWeatherInfo} />
      <DailyContainer dailyWeatherInfo={dailyWeatherInfo} />
      <CurrentWeatherContainer currentWeatherInfo={currentWeatherInfo} cityName={currentLocation.village} />
    </div>
  );
}

export default CurrentCity;
