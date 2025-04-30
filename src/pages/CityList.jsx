import React, { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import Header from "../components/ui/Header";
import PageContainer from "../components/ui/PageContainer";
// import mockCities from "../mockCities";
import Card from "../components/ui/Card";
import formatTime from "../utils/timeFormatter";
import { IoCloseSharp } from "react-icons/io5";
import { Link } from "react-router";
import axios from "axios";
import getDayLabel from "../utils/dayLabel";

const key = import.meta.env.VITE_OPENWEATHER_API_KEY;
const url = import.meta.env.VITE_OPENWEATHER_ONECALL_API_URL;

function CityList() {
  const [searchMode, setSearchMode] = useState(false);
  const [favoriteCities, setFavoriteCities] = useState([]);

  // Track the city being dragged/swiped
  const [draggedId, setDraggedId] = useState(null);
  const [swiped, setSwiped] = useState(false);

  useEffect(() => {
    const fetchLiveWeatherData = async () => {
      const stored = JSON.parse(localStorage.getItem("savedCities")) || [];

      const updatedCities = await Promise.all(
        stored.map(async (city) => {
          const { lat, lon, name, cityId } = city;

          try {
            const res = await axios.get(url, {
              params: {
                lat,
                lon,
                appid: key,
                units: "metric",
              },
            });

            const data = res.data;

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
        
            const updatedCity = {
              ...city,
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
                hourlyTime: hourlyData.map((i) => i.time),
                hourlyTemperature: hourlyData.map((i) => i.temperature),
                hourlyWeatherIcon: hourlyData.map((i) => i.icon),
              },

              dailyWeatherInfo: dailyData, // 🔥 ADD THIS
            };

            console.log(`Fetched weather data for ${name}:`, updatedCity);
            return updatedCity;
          } catch (err) {
            console.error(`Error fetching weather for ${name}:`, err.message);
            return city;
          }
        })
      );

      setFavoriteCities(updatedCities);
      console.log("Updated favoriteCities state:", updatedCities);
    };

    fetchLiveWeatherData();
  }, [searchMode]);

  function toggleSearchMode() {
    setSearchMode((prevMode) => !prevMode);
  }
  function handleDelete(id) {
    const updated = favoriteCities.filter((city) => city.cityId !== id);
    setFavoriteCities(updated);
    localStorage.setItem("savedCities", JSON.stringify(updated)); // \u2190 update storage
    setDraggedId(null);
    setSwiped(false);
  }

  return (
    <PageContainer>
      {/* Header */}
      {!searchMode && <Header title={"My Cities"} />}

      {/* Search */}
      {searchMode ? (
        <SearchBar toggleSearchMode={toggleSearchMode} />
      ) : (
        <div
          onClick={toggleSearchMode}
          className="bg-gray-800 rounded-[10px] text-gray-500 p-2 mt-4"
        >
          Search City
        </div>
      )}

      {/* Favorite City Cards */}
      {!searchMode && (
        <div className="mt-6">
          {favoriteCities.map((city) => (
            <div
              key={city.cityId}
              className="relative flex items-center h-[100%]" // Parent flex container
              onTouchStart={() => {
                setDraggedId(city.cityId);
              }}
              onTouchMove={(e) => {
                const touchX = e.touches[0].clientX;
                if (touchX < 150) {
                  setSwiped(true); // activate squeezed look
                }
              }}
              onTouchEnd={() => {
                // optional: reset swipe if you want automatic return
                // setDraggedId(null);
                // setSwiped(false);
              }}
            >
              {/* Card */}
              <div
                className={`transition-all duration-400  ${
                  draggedId === city.cityId && swiped
                    ? "flex-grow-[0.95]" // squeezed when swiped
                    : "flex-grow"
                }`}
              >
                <Card>
                  <div className="flex justify-between">
                    <Link
                      to={`/test/${city.cityId || "unknown"}`}
                      key={city.cityId}
                      state={{
                        currentWeatherInfo: city,
                        cityName: city.name,
                      }}
                      className="flex flex-col justify-between h-8 visited:text-white"
                    >
                      <h2 className="font-bold text-2xl">{city.name}</h2>
                      <span className="text-sm font-bold text-gray-400">
                        {formatTime(city.time)}
                      </span>
                    </Link>
                    <div>
                      <span className="text-5xl font-regular">
                        {city.temperature}&deg;
                      </span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Delete Button - only if swiped this card */}
              {draggedId === city.cityId && swiped && (
                <button
                  onClick={() => handleDelete(city.cityId)}
                  className="ml-4 flex-shrink-0 p-5 bg-[#d53d3d] hover:bg-red-400 active:bg-red-400 focus:bg-red-400 text-white rounded-[15px] h-[100px] w-[20%]"
                >
                  <IoCloseSharp size={"35px"} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  );
}

export default CityList;
