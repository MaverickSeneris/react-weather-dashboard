import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import SearchBar from "../components/SearchBar";
import Header from "../components/ui/Header";
import PageContainer from "../components/ui/PageContainer";
import Card from "../components/ui/Card";
import formatTime from "../utils/timeFormatter";
import { IoCloseSharp, IoArrowUndo } from "react-icons/io5";
import { Link } from "react-router";
import axios from "axios";
import getDayLabel from "../utils/dayLabel";
import { useWeatherSettings } from "../utils/hooks/useWeatherSettings";

const key = import.meta.env.VITE_OPENWEATHER_API_KEY;
const url = import.meta.env.VITE_OPENWEATHER_ONECALL_API_URL;

function CityList() {
  const [searchMode, setSearchMode] = useState(false);
  const [favoriteCities, setFavoriteCities] = useState([]);
  const { settings } = useWeatherSettings();
  // Undo feature state
  const [deletedCity, setDeletedCity] = useState(null);
  const [undoTimeout, setUndoTimeout] = useState(null);

  const convertTemp = (temp) => {
    return settings.temperature === "Fahrenheit"
      ? Math.round((temp * 9) / 5 + 32)
      : Math.round(temp);
  };
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
                time: hourlyData.map((i) => i.time),
                temperature: hourlyData.map((i) => i.temperature),
                icon: hourlyData.map((i) => i.icon),
              },

              dailyWeatherInfo: dailyData,
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
    const cityToDelete = favoriteCities.find((city) => city.cityId === id);
    if (!cityToDelete) return;

    // Store deleted city for undo
    setDeletedCity(cityToDelete);
    
    // Remove from state and storage
    const updated = favoriteCities.filter((city) => city.cityId !== id);
    setFavoriteCities(updated);
    localStorage.setItem("savedCities", JSON.stringify(updated));
    setDraggedId(null);
    setSwiped(false);

    // Clear any existing timeout
    if (undoTimeout) {
      clearTimeout(undoTimeout);
    }

    // Set timeout to clear undo option after 5 seconds
    const timeout = setTimeout(() => {
      setDeletedCity(null);
    }, 5000);
    setUndoTimeout(timeout);
  }

  function handleUndo() {
    if (!deletedCity) return;

    // Restore the deleted city
    const restored = [...favoriteCities, deletedCity];
    setFavoriteCities(restored);
    localStorage.setItem("savedCities", JSON.stringify(restored));
    
    // Clear undo state
    setDeletedCity(null);
    if (undoTimeout) {
      clearTimeout(undoTimeout);
      setUndoTimeout(null);
    }
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (undoTimeout) {
        clearTimeout(undoTimeout);
      }
    };
  }, [undoTimeout]);

  return (
    <PageContainer>
      {/* Header */}
      {!searchMode && <Header title={"My Cities"} />}

      {/* Search */}
      {searchMode ? (
        <SearchBar toggleSearchMode={toggleSearchMode} />
      ) : (
        <motion.div
          onClick={toggleSearchMode}
          className="rounded-[10px] p-2 mt-4 cursor-pointer transition-all"
          style={{ 
            backgroundColor: 'var(--bg-2)', 
            color: 'var(--gray)'
          }}
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            type: "spring",
            damping: 20,
            stiffness: 300,
            delay: 0.1,
          }}
          whileHover={{
            scale: 1.05,
            backgroundColor: 'var(--bg-1)',
            transition: { duration: 0.2 },
          }}
          whileTap={{ scale: 0.95 }}
        >
          Search City
        </motion.div>
      )}

      {/* Favorite City Cards */}
      {!searchMode && (
        <div className="mt-6">
          {favoriteCities.map((city, index) => {
            const CardWrapper = ({ children }) => {
              const ref = useRef(null);
              const isInView = useInView(ref, { once: true, margin: "-100px" });
              const isEven = index % 2 === 0;
              
              return (
                <motion.div
                  ref={ref}
                  initial={{ 
                    opacity: 0, 
                    x: isEven ? -100 : 100,
                    scale: 0.85
                  }}
                  animate={isInView ? { 
                    opacity: 1, 
                    x: 0,
                    scale: 1
                  } : { 
                    opacity: 0, 
                    x: isEven ? -100 : 100,
                    scale: 0.85
                  }}
                  exit={{ opacity: 0, x: isEven ? -100 : 100 }}
                  transition={{ 
                    type: "spring", 
                    damping: 15, 
                    stiffness: 200,
                    delay: 0.15,
                    duration: 0.6
                  }}
                  className="relative flex items-center h-[100%]"
                >
                  {children}
                </motion.div>
              );
            };

            return (
              <CardWrapper key={city.cityId}>
                <div
                  className="relative flex items-center h-[100%] w-full"
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
                      className="flex flex-col justify-between h-8"
                      style={{ color: 'var(--fg)' }}
                    >
                      <h2 className="font-bold text-2xl">{city.name}</h2>
                      <span className="text-sm font-bold" style={{ color: 'var(--gray)' }}>
                        {formatTime(city.time, settings.timeFormat)}
                      </span>
                    </Link>
                    <div>
                      <span className="text-5xl font-regular">
                        {convertTemp(city.temperature)}&deg;
                      </span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Delete Button - only if swiped this card */}
              <AnimatePresence>
                {draggedId === city.cityId && swiped && (
                  <motion.button
                    initial={{ opacity: 0, x: -20, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -20, scale: 0.8 }}
                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                    onClick={() => handleDelete(city.cityId)}
                    whileHover={{ scale: 1.1, opacity: 0.9 }}
                    whileTap={{ scale: 0.95 }}
                    className="ml-4 flex-shrink-0 p-5 rounded-[15px] h-[100px] w-[20%] flex items-center justify-center"
                    style={{ 
                      backgroundColor: 'var(--red)', 
                      color: 'var(--bg-0)'
                    }}
                  >
                    <motion.div
                      animate={{ rotate: [0, 90, 0] }}
                      transition={{ duration: 0.3 }}
                    >
                      <IoCloseSharp size={35} />
                    </motion.div>
                  </motion.button>
                )}
              </AnimatePresence>
                </div>
              </CardWrapper>
            );
          })}
        </div>
      )}

      {/* Undo Notification */}
      <AnimatePresence>
        {deletedCity && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-md"
          >
            <Card>
              <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3">
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-xs sm:text-sm flex-shrink min-w-0 truncate flex-1" 
                  style={{ color: 'var(--fg)' }}
                  title={`City "${deletedCity.name}" deleted`}
                >
                  <span className="hidden sm:inline">City "{deletedCity.name}" deleted</span>
                  <span className="sm:hidden">"{deletedCity.name}" deleted</span>
                </motion.span>
                <motion.button
                  onClick={handleUndo}
                  whileHover={{ scale: 1.05, backgroundColor: 'var(--yellow)' }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg font-semibold text-xs sm:text-sm flex-shrink-0 whitespace-nowrap"
                  style={{ 
                    backgroundColor: 'var(--green)', 
                    color: 'var(--bg-0)'
                  }}
                >
                  <motion.div
                    animate={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <IoArrowUndo size={14} className="sm:w-4 sm:h-4" />
                  </motion.div>
                  <span>Undo</span>
                </motion.button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </PageContainer>
  );
}

export default CityList;
