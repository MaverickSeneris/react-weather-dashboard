import React, { useState, useEffect } from "react";
import CityCard from "./ui/CityCard";



const url = import.meta.env.VITE_OPENWEATHER_ONECALL_API_URL;
const key = import.meta.env.VITE_OPENWEATHER_API_KEY;

function SearchBar() {
  const [cities, setCities] = useState({});
  const [searchMode, setSearchMode] = useState(false);
  const [search, setSearch] = useState("");
  const [weatherData, setWeatherData] = useState([]);

  console.log(cities)

  // Fetch city coordinates from Geocoding API
  const fetchCities = async (query) => {
    if (!query) return;

    const res = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${key}`
    );
    const data = await res.json();
    setCities(data);
  };

  // Fetch weather data for each city
  const fetchWeather = async () => {
    const promises = cities.map(async (city) => {
      const res = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${city.lat}&lon=${city.lon}&exclude=minutely,hourly,daily,alerts&units=metric&appid=${key}`
      );
      const data = await res.json();
      return {
        name: city.name,
        temp: data.current.temp,
        condition: data.current.weather[0].main.toLowerCase(),
      };
    });

    const results = await Promise.all(promises);
    setWeatherData(results);
  };

  // Search and fetch on typing
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchCities(search);
    }, 500); // debounce typing

    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    if (cities.length > 0) {
      fetchWeather();
    }
  }, [cities]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search city"
        className="mb-4 p-2 w-full rounded-[10px] bg-gray-800"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div>
        <CityCard weatherData={weatherData}/>
      </div>
    </div>

  );
}

export default SearchBar;
