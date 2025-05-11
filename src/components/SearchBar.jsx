import React, { useState, useEffect } from "react";
import CityCard from "./ui/CityCard";
import CancelButton from "./ui/CancelButton";
import generateUUID from "../utils/uuidGenerator";
import formatTime from "../utils/timeFormatter";
import getDayLabel from "../utils/dayLabel";
import mockCities from "../mockCities";

// API configuration
const url = import.meta.env.VITE_OPENWEATHER_ONECALL_API_URL;
const key = import.meta.env.VITE_OPENWEATHER_API_KEY;

function SearchBar({ toggleSearchMode, handleAddCity }) {
  const [cities, setCities] = useState({});
  const [searchMode, setSearchMode] = useState(false);
  const [search, setSearch] = useState("");
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(false); // Console-only loading state

  console.log(weatherData);
  console.log(
    "🔍 Info [SearchBar.jsx > useState()] — Initial cities state:",
    cities
  );

  // Fetch city coordinates
  const fetchCities = async (query) => {
    if (!query) return;
    console.log(
      `🧭 Info [SearchBar.jsx > fetchCities()] — Searching for "${query}"... possibly at line 20`
    );

    try {
      setLoading(true);
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${key}`
      );
      if (!res.ok) throw new Error(`Status: ${res.status}`);

      const data = await res.json();
      setCities(data);
      console.log(
        "✅ Success [SearchBar.jsx > fetchCities()] — Fetched coordinates successfully at line 29:",
        data
      );
    } catch (error) {
      console.error(
        "❌ Error [SearchBar.jsx > fetchCities()] — possibly at line 31:",
        error
      );
    } finally {
      setLoading(false);
      console.log(
        "⚙️ Info [SearchBar.jsx > fetchCities()] — Done loading at line 34"
      );
    }
  };

  // Fetch weather for each city
  const fetchWeather = async () => {
    if (!Array.isArray(cities) || cities.length === 0) return;

    console.log(
      "☁️ Info [SearchBar.jsx > fetchWeather()] — Fetching weather for all cities... possibly at line 41"
    );
    setLoading(true);

    try {
      const promises = cities.map(async (city, index) => {
        console.log(
          `📍 Info [SearchBar.jsx > fetchWeather()] — Fetching weather for ${
            city.name
          } (city #${index + 1})...`
        );

        try {
          const res = await fetch(
            `https://api.openweathermap.org/data/3.0/onecall?lat=${city.lat}&lon=${city.lon}&exclude=minutely,alerts&units=metric&appid=${key}`
          );
          if (!res.ok) throw new Error(`Status: ${res.status}`);

          const data = await res.json();

          console.log(
            `✅ Success [SearchBar.jsx > fetchWeather()] — Weather for ${city.name} fetched at line 52:`,
            data
          );

          const hourlyData = data.hourly
            .filter((_, i) => i >= 2 && (i - 2) % 3 === 0)
            .slice(0, 3)
            .map((d) => ({
              time: formatTime(d.dt),
              temperature: d.temp,
              icon: d.weather?.[0]?.icon,
            }));

          const dailyData = data.daily.slice(0, 7).map((d, i) => ({
            day: getDayLabel(d.dt, i),
            icon: d.weather[0]?.icon || "",
            description: d.weather[0]?.description || "",
            tempHigh: Math.round(d.temp.max),
            tempLow: Math.round(d.temp.min),
          }));

          return {
            cityId: generateUUID(),
            // City data:
            name: city.name,
            state: city.state,
            country: city.country,
            lat: city.lat,
            lon: city.lon,

            // Current Weather Data
            temperature: Math.floor(data.current.temp),
            condition: data.current.weather[0].main.toLowerCase(),
            weatherIcon: data.current.weather[0].icon,
            time: data.current.dt,
            uvIndex: Math.ceil(data.current.uvi),
            windSpeed: data.current.wind_speed,
            humidity: data.current.humidity,
            visibility: data.current.visibility,
            feelsLike: Math.floor(data.current.feels_like),
            pressure: data.current.pressure,
            sunset: data.current.sunset,
            sunrise: data.current.sunrise,
            chanceOfRain: Math.round(data.daily[0].pop * 100),

            hourlyWeatherInfo: {
              time: hourlyData.map((i) => i.time),
              temperature: hourlyData.map((i) => i.temperature),
              icon: hourlyData.map((i) => i.icon),
            },

            //TODO MON, 04/28/25: RENDER DAILY(7-day forcast) WEATHER INFORMATION
            dailyWeatherInfo: dailyData,
          };
        } catch (innerErr) {
          console.error(
            `❌ Error [SearchBar.jsx > fetchWeather()] — for ${city.name}, possibly at line 61:`,
            innerErr
          );
          return null;
        }
      });

      const results = await Promise.all(promises);
      setWeatherData(results.filter(Boolean));
    } catch (err) {
      console.error(
        "❌ Error [SearchBar.jsx > fetchWeather()] — General error, possibly at line 69:",
        err
      );
    } finally {
      setLoading(false);
      console.log(
        "⚙️ Info [SearchBar.jsx > fetchWeather()] — Done fetching all cities at line 72"
      );
    }
  };

  // Debounce user input
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchCities(search);
    }, 500);

    return () => clearTimeout(timeout);
  }, [search]);

  // Trigger weather fetch
  useEffect(() => {
    if (Array.isArray(cities) && cities.length > 0) {
      fetchWeather();
    }
  }, [cities]);

  return (
    <div>
      <div className="flex gap-2 items-center">
        <input
          type="text"
          placeholder="Search city"
          className="my-4 p-2 w-full rounded-[10px] bg-slate-100 dark:bg-gray-800 outline-0"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <CancelButton nameSymbol={"Cancel"} toggler={toggleSearchMode} />
      </div>

      <div>
        {/* Please replace weatherdata when in production*/}
        <CityCard weatherData={weatherData}/>
      </div>
    </div>
  );
}

export default SearchBar;
