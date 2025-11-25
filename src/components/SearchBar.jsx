import React, { useState, useEffect } from "react";
import CityCard from "./ui/CityCard";
import CancelButton from "./ui/CancelButton";
import generateUUID from "../utils/uuidGenerator";
import formatTime from "../utils/timeFormatter";
import getDayLabel from "../utils/dayLabel";


// API configuration
const url = import.meta.env.VITE_OPENWEATHER_ONECALL_API_URL;
const key = import.meta.env.VITE_OPENWEATHER_API_KEY;

function SearchBar({ toggleSearchMode, handleAddCity }) {
  const [cities, setCities] = useState({});
  const [searchMode, setSearchMode] = useState(false);
  const [search, setSearch] = useState("");
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(false); // Console-only loading state

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

          if (!data || !data.current) {
            throw new Error("Invalid weather data received");
          }

          console.log(
            `✅ Success [SearchBar.jsx > fetchWeather()] — Weather for ${city.name} fetched at line 52:`,
            data
          );

          // Get timezone offset from API or calculate from longitude
          const timezoneOffset = data.timezone_offset !== undefined 
            ? data.timezone_offset 
            : Math.round((city.lon / 15) * 3600);

          const hourlyData = (data.hourly || [])
            .filter((_, i) => i >= 2 && (i - 2) % 3 === 0)
            .slice(0, 3)
            .map((d) => ({
              time: formatTime(d.dt),
              temperature: d.temp || 0,
              icon: d.weather?.[0]?.icon,
            }));

          const dailyData = (data.daily || []).slice(0, 7).map((d, i) => ({
            day: getDayLabel(d.dt, i),
            icon: d.weather?.[0]?.icon || "",
            description: d.weather?.[0]?.description || "",
            tempHigh: Math.round(d.temp?.max || 0),
            tempLow: Math.round(d.temp?.min || 0),
          }));

          return {
            cityId: generateUUID(),
            // City data:
            name: city.name || "Unknown",
            state: city.state || "",
            country: city.country || "",
            lat: city.lat || 0,
            lon: city.lon || 0,

            // Current Weather Data
            temperature: Math.floor(data.current.temp || 0),
            condition: data.current.weather?.[0]?.main?.toLowerCase() || "unknown",
            weatherIcon: data.current.weather?.[0]?.icon || "01d",
            time: data.current.dt || Math.floor(Date.now() / 1000),
            timezoneOffset: timezoneOffset,
            uvIndex: Math.ceil(data.current.uvi || 0),
            windSpeed: data.current.wind_speed || 0,
            humidity: data.current.humidity || 0,
            visibility: data.current.visibility || null,
            feelsLike: Math.floor(data.current.feels_like || 0),
            pressure: data.current.pressure || 0,
            sunset: data.current.sunset || 0,
            sunrise: data.current.sunrise || 0,
            chanceOfRain: Math.round((data.daily?.[0]?.pop || 0) * 100),

            hourlyWeatherInfo: {
              time: hourlyData.map((i) => i.time),
              temperature: hourlyData.map((i) => i.temperature),
              icon: hourlyData.map((i) => i.icon),
            },

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
          className="my-4 p-2 w-full rounded-[10px] outline-0"
          style={{ 
            backgroundColor: 'var(--bg-2)', 
            color: 'var(--fg)',
            border: '1px solid transparent'
          }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--blue)';
            e.target.style.backgroundColor = 'var(--bg-1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'transparent';
            e.target.style.backgroundColor = 'var(--bg-2)';
          }}
          autoFocus
        />
        <CancelButton nameSymbol={"Cancel"} toggler={toggleSearchMode} />
      </div>

      <div>
        <CityCard weatherData={weatherData}/>
      </div>
    </div>
  );
}

export default SearchBar;
