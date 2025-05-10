import React, { useState, useEffect } from "react";
import axios from "axios";
import iconMap from "../utils/weatherIconMapper";
import formatTime from "../utils/timeFormatter";
import getDayLabel from "../utils/dayLabel";
import CurrentCityContainer from "../components/CurrentCityContainer";
import HourlyContainer from "../components/HourlyContainer";
import DailyContainer from "../components/DailyContainer";
import CurrentWeatherContainer from "../components/CurrentWeatherContainer";
import generateUUID from "../utils/uuidGenerator";
import { useWeatherSettings } from "../utils/hooks/useWeatherSettings";

function CurrentCity() {
  const { settings } = useWeatherSettings();
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
  const [unit, setUnit] = useState("metric");

  useEffect(() => {
    console.log("📡 Fetching geolocation...");
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        console.log("✅ Coordinates:", latitude, longitude);
        fetchLocation(latitude, longitude);
        fetchWeather(latitude, longitude);
      },
      (error) => {
        console.error("❌ Geolocation error (line 38):", error.message);
      }
    );
  }, [unit]);

  // Fetch city/village/region from OpenCage API
  const fetchLocation = async (lat, lon) => {
    console.log("⏳ Loading location data...");
    try {
      const geoKey = import.meta.env.VITE_OPENCAGE_API_KEY;
      const res = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${geoKey}`
      );
      const c = res.data.results[0].components;

      console.log("🌍 Location data:", c);

      setCurrentLocation({
        town: c.town || "",
        state: c.state || "",
        country: c.country || "",
        village: c.village || "",
        region: c.region || "",
      });
    } catch (err) {
      console.error(
        "❌ Error in [CurrentCity.jsx > fetchLocation()] —  possibly at line 51",
        err
      );
    }
  };

  // Fetch weather data from OpenWeather API
  const fetchWeather = async (lat, lon) => {
    console.log("⏳ Loading weather data...");
    try {
      const url = import.meta.env.VITE_OPENWEATHER_ONECALL_API_URL;
      const key = import.meta.env.VITE_OPENWEATHER_API_KEY;

      const res = await axios.get(
        `${url}lat=${lat}&lon=${lon}&appid=${key}&units=${unit}`
      );
      const data = res.data;

      console.log("🌤️ Full weather data:", data);
      console.log("🌡️ Current weather:", data.current);
      console.log("🕒 Hourly weather (raw):", data.hourly);
      console.log("📆 Daily weather (raw):", data.daily);

      // Current weather state
      setCurrentWeatherInfo({
        cityId: generateUUID(),
        temperature: Math.floor(data.current.temp) || "",
        weatherIcon: data.current.weather[0]?.icon || "",
        description: data.current.weather[0]?.description || "",
        feelsLike: Math.floor(data.current.feels_like) || 0,
        uvIndex: Math.ceil(data.current.uvi) || 0,
        windSpeed: data.current.wind_speed || 0,
        chanceOfRain: Math.round(data.daily?.[0]?.pop * 100) ?? 0,
        pressure: data.current.pressure || "",
        visibility: data.current.visibility || "",
        humidity: data.current.humidity || "",
        sunset: data.current.sunset || "",
        sunrise: data.current.sunrise || "",
      });

      // Hourly forecast state
      const hourlyData = data.hourly
        .filter((_, i) => i >= 2 && (i - 2) % 3 === 0)
        .slice(0, 3)
        .map((d) => ({
          time: formatTime(d.dt),
          temperature: d.temp,
          icon: d.weather?.[0]?.icon,
        }));

      console.log("🕒 Formatted hourly data:", hourlyData);

      setHourlyWeatherInfo({
        time: hourlyData.map((i) => i.time),
        temperature: hourlyData.map((i) => i.temperature),
        icon: hourlyData.map((i) => i.icon),
      });

      // Daily forecast state
      const dailyData = data.daily.slice(0, 7).map((d, i) => ({
        day: getDayLabel(d.dt, i),
        icon: d.weather[0]?.icon || "",
        description: d.weather[0]?.description || "",
        tempHigh: Math.round(d.temp.max),
        tempLow: Math.round(d.temp.min),
      }));

      console.log("📆 Formatted daily data:", dailyData);

      setDailyWeatherInfo(dailyData);
    } catch (err) {
      console.error(
        "❌ Error in [CurrentCity.jsx > fetchWeather()] —  possibly at line 75",
        err
      );
    }
  };

  return (
    <div className={`flex flex-col items-center w-screen px-4 pt-10 pb-2 ${settings.dark ? "bg-neutral-900 text-white": "bg-white text-black"}`} >
      <CurrentCityContainer
        cityName={currentLocation.village}
        popValue={currentWeatherInfo.chanceOfRain}
        weatherIcon={iconMap[currentWeatherInfo.weatherIcon]}
        tempValue={currentWeatherInfo.temperature}
      />
      <HourlyContainer hourlyWeatherInfo={hourlyWeatherInfo} />
      <DailyContainer dailyWeatherInfo={dailyWeatherInfo} />
      <CurrentWeatherContainer
        currentWeatherInfo={currentWeatherInfo}
        cityName={currentLocation.village}
      />
    </div>
  );
}

export default CurrentCity;
