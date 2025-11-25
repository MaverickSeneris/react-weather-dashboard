import React, { useState } from "react";
import { motion } from "framer-motion";
import Card from "./Card";
import iconMap from "../../utils/weatherIconMapper";
import timeFormatter from "../../utils/timeFormatter";
import { Link } from "react-router";
import { IoAddSharp, IoChevronDown } from "react-icons/io5";
import { useWeatherSettings } from "../../utils/hooks/useWeatherSettings";
import { checkSevereWeather } from "../../utils/weatherAlertChecker";
import { convertTemperature, convertWindSpeed, convertDistance } from "../../utils/unitConverter";

const CityCard = ({ weatherData }) => {
  const [draggedId, setDraggedId] = useState(null);
  const [swipeDistance, setSwipeDistance] = useState({});
  const [touchStartX, setTouchStartX] = useState({});
  const [saveMessages, setSaveMessages] = useState({});
  // Expanded cards state
  const [expandedCards, setExpandedCards] = useState(new Set());

  const { settings } = useWeatherSettings(); // ✅ use settings

  const convertTemp = (temp) => {
    return Math.round(convertTemperature(temp, settings.temperature));
  };

  const convertWind = (speedMps) => {
    return convertWindSpeed(speedMps, settings.windSpeed);
  };

  const convertVis = (visibilityMeters) => {
    const visibilityKm = visibilityMeters / 1000;
    const converted = convertDistance(visibilityKm, settings.distance);
    return converted.toFixed(1);
  };

  const getDistanceUnit = () => {
    return settings.distance?.toLowerCase() === "miles" ? "mi" : "km";
  };

  const formatWindSpeedUnit = (unit) => {
    if (!unit) return "km/h";
    const lower = unit.toLowerCase();
    if (lower === "km/h" || lower === "kmh") return "km/h";
    if (lower === "m/s" || lower === "ms") return "m/s";
    if (lower === "knots") return "Knots";
    if (lower === "mph") return "mph";
    return unit; // Return as-is if not recognized
  };

  function handleSaveCity(cityId) {
    try {
    const city = weatherData.find((c) => c.cityId === cityId);
      if (!city) {
        console.error("City not found:", cityId);
        return;
      }

      // Save full city data with all weather information
    const savedCity = {
      cityId: city.cityId,
      name: city.name,
        state: city.state,
        country: city.country,
      lat: city.lat,
      lon: city.lon,
        // Include all weather data to prevent NaN
        temperature: city.temperature,
        condition: city.condition,
        weatherIcon: city.weatherIcon,
        time: city.time,
        timezoneOffset: city.timezoneOffset,
        uvIndex: city.uvIndex,
        windSpeed: city.windSpeed,
        humidity: city.humidity,
        visibility: city.visibility,
        feelsLike: city.feelsLike,
        pressure: city.pressure,
        sunset: city.sunset,
        sunrise: city.sunrise,
        chanceOfRain: city.chanceOfRain,
        hourlyWeatherInfo: city.hourlyWeatherInfo,
        dailyWeatherInfo: city.dailyWeatherInfo,
    };

    const saved = JSON.parse(localStorage.getItem("savedCities")) || [];
    const isDuplicate = saved.some(
      (c) => c.lat === savedCity.lat && c.lon === savedCity.lon
    );

    const newMessage = isDuplicate
      ? "\u26a0\ufe0f Already saved."
      : "\u2705 City saved!";

    setSaveMessages((prev) => ({ ...prev, [cityId]: newMessage }));
    setTimeout(() => {
      setSaveMessages((prev) => ({ ...prev, [cityId]: "" }));
    }, 3000);

    if (isDuplicate) return;

    const updated = [...saved, savedCity];
    localStorage.setItem("savedCities", JSON.stringify(updated));
      
      // Trigger custom event to notify CityList to refresh (same tab)
      window.dispatchEvent(new Event('cityAdded'));
      
    console.log("\u2705 City saved!", savedCity);

    setDraggedId(null);
      setSwipeDistance((prev) => ({ ...prev, [cityId]: 0 }));
      setTouchStartX((prev) => ({ ...prev, [cityId]: 0 }));
    } catch (error) {
      console.error("Error saving city:", error);
      setSaveMessages((prev) => ({ ...prev, [cityId]: "❌ Error saving city" }));
      setTimeout(() => {
        setSaveMessages((prev) => ({ ...prev, [cityId]: "" }));
      }, 3000);
    }
  }

  return (
    <div className="space-y-1">
      {weatherData.map((city) => {
        const isDragging = draggedId === city.cityId;
        const currentSwipeDistance = swipeDistance[city.cityId] || 0;
        const deleteButtonWidth = 80; // Width of add button
        const swipeThreshold = 50; // Minimum swipe to show add button
        const maxSwipe = deleteButtonWidth + 20; // Max swipe distance
        
        // Calculate if add button should be visible
        const showAdd = currentSwipeDistance > swipeThreshold;
        // Clamp swipe distance
        const clampedSwipe = Math.min(Math.max(currentSwipeDistance, 0), maxSwipe);

        // Check for severe weather - adapt city data structure
        const cityWeatherData = {
          current: {
            temperature: city.temperature,
            feelsLike: city.feelsLike,
            uvIndex: city.uvIndex,
            chanceOfRain: city.chanceOfRain,
            windSpeed: city.windSpeed,
            description: city.description || city.condition,
            visibility: city.visibility,
            humidity: city.humidity,
          },
        };
        const severeWeather = checkSevereWeather(cityWeatherData);
        const borderColor = severeWeather.hasSevere
          ? severeWeather.alertType === "danger"
            ? "var(--red)"
            : "var(--yellow)"
          : "transparent";

        return (
        <div
          key={city.cityId}
            className="relative flex items-center w-full"
            onTouchStart={(e) => {
              setDraggedId(city.cityId);
              setTouchStartX((prev) => ({ ...prev, [city.cityId]: e.touches[0].clientX }));
            }}
          onTouchMove={(e) => {
              if (!isDragging) return;
              const touchX = e.touches[0].clientX;
              const startX = touchStartX[city.cityId] || touchX;
              const deltaX = startX - touchX; // Negative when swiping left
              
              if (deltaX > 0) {
                // Swiping left
                setSwipeDistance((prev) => ({ ...prev, [city.cityId]: deltaX }));
              } else {
                // Swiping right - reset
                setSwipeDistance((prev) => ({ ...prev, [city.cityId]: 0 }));
              }
            }}
            onTouchEnd={() => {
              // If swipe wasn't far enough, snap back
              if (currentSwipeDistance < swipeThreshold) {
                setSwipeDistance((prev) => ({ ...prev, [city.cityId]: 0 }));
              } else {
                // Keep it open
                setSwipeDistance((prev) => ({ ...prev, [city.cityId]: maxSwipe }));
              }
            }}
            style={{ touchAction: 'pan-y' }}
          >
            {/* Card */}
            <motion.div
              className="flex-grow"
              animate={{
                x: -clampedSwipe,
              }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
              }}
              style={{ willChange: 'transform' }}
          >
              <Card
                compact={true}
                style={{
                  borderLeft: severeWeather.hasSevere ? `4px solid ${borderColor}` : undefined,
                }}
              >
              {saveMessages[city.cityId] ? (
                <div className="flex items-center justify-center w-full font-bold h-[55px]" style={{ color: 'var(--fg)' }}>
                  {saveMessages[city.cityId]}
                </div>
              ) : (
                  <div className="flex items-center justify-between w-full h-[55px]">
                <Link
                  to={`/test/${city.cityId || "unknown"}`}
                  state={{ currentWeatherInfo: city, cityName: city.name }}
                      className="flex items-center gap-5 flex-1 visited:text-white"
                >
                    <img
                      src={iconMap[city.weatherIcon]}
                      alt="weatherIcon"
                      className="w-15 mt-3"
                    />
                    <div className="flex flex-col items-start">
                      <div className="flex items-center gap-2">
                          <span className="font-bold text-sm" style={{ color: 'var(--fg)' }}>
                          {city.name}
                        </span>
                        <span className="text-xs font-regular">
                          {city.country}
                        </span>
                      </div>
                      <p className="text-xs">{city.state}</p>
                        <div className="text-xs font-semibold" style={{ color: 'var(--gray)' }}>
                          {(() => {
                            try {
                              // Calculate local time for this city without API calls
                              if (!city.time || isNaN(city.time)) return '';
                              
                              // Get timezone offset (in seconds from UTC)
                              const timezoneOffset = (city.timezoneOffset !== undefined && !isNaN(city.timezoneOffset))
                                ? city.timezoneOffset 
                                : (city.lon && !isNaN(city.lon)) 
                                  ? Math.round((city.lon / 15) * 3600)
                                  : 0;
                              
                              // Create Date from UTC timestamp
                              const utcDate = new Date(city.time * 1000);
                              
                              if (isNaN(utcDate.getTime())) return '';
                              
                              // Get UTC hours and minutes
                              let hours = utcDate.getUTCHours();
                              let minutes = utcDate.getUTCMinutes();
                              
                              // Add timezone offset (convert seconds to hours)
                              const offsetHours = Math.floor(timezoneOffset / 3600);
                              const offsetMinutes = Math.floor((timezoneOffset % 3600) / 60);
                              
                              hours = hours + offsetHours;
                              minutes = minutes + offsetMinutes;
                              
                              // Handle overflow
                              if (minutes >= 60) {
                                hours += 1;
                                minutes -= 60;
                              } else if (minutes < 0) {
                                hours -= 1;
                                minutes += 60;
                              }
                              
                              // Handle hour overflow
                              if (hours >= 24) {
                                hours -= 24;
                              } else if (hours < 0) {
                                hours += 24;
                              }
                              
                              // Format time
                              const is12Hour = settings.timeFormat === "12 Hour";
                              
                              if (is12Hour) {
                                const period = hours >= 12 ? 'PM' : 'AM';
                                const displayHours = hours % 12 || 12;
                                return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
                              } else {
                                return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                              }
                            } catch (error) {
                              console.error("Error calculating local time:", error);
                              return '';
                            }
                          })()}
                        </div>
                      </div>
                    </Link>

                    <div className="flex flex-col items-end self-start">
                      <div className="text-2xl font-medium">
                        {convertTemp(city.temperature)}&deg;
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex justify-center mt-1">
                  <motion.button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const isExpanded = expandedCards.has(city.cityId);
                      if (isExpanded) {
                        setExpandedCards(prev => {
                          const newSet = new Set(prev);
                          newSet.delete(city.cityId);
                          return newSet;
                        });
                      } else {
                        setExpandedCards(prev => new Set(prev).add(city.cityId));
                      }
                    }}
                    className="p-0"
                    style={{ 
                      color: severeWeather.hasSevere ? borderColor : 'var(--gray)',
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    animate={{
                      rotate: expandedCards.has(city.cityId) ? 180 : 0
                    }}
                  >
                    <IoChevronDown size={18} />
                  </motion.button>
                </div>
                {expandedCards.has(city.cityId) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                    className="mt-2 pt-2 border-t"
                    style={{ borderColor: 'var(--bg-2)' }}
                  >
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span style={{ color: 'var(--gray)' }}>Feels like: </span>
                            <span style={{ color: 'var(--fg)' }}>
                              {city.feelsLike !== undefined && !isNaN(city.feelsLike) 
                                ? `${convertTemp(city.feelsLike)}°` 
                                : 'N/A'}
                            </span>
                          </div>
                          <div>
                            <span style={{ color: 'var(--gray)' }}>Rain: </span>
                            <span style={{ color: 'var(--fg)' }}>
                              {city.chanceOfRain !== undefined && !isNaN(city.chanceOfRain) 
                                ? `${city.chanceOfRain}%` 
                                : '0%'}
                            </span>
                          </div>
                          <div>
                            <span style={{ color: 'var(--gray)' }}>UV Index: </span>
                            <span style={{ color: 'var(--fg)' }}>
                              {city.uvIndex !== undefined && !isNaN(city.uvIndex) 
                                ? city.uvIndex 
                                : '0'}
                            </span>
                          </div>
                          <div>
                            <span style={{ color: 'var(--gray)' }}>Wind: </span>
                            <span style={{ color: 'var(--fg)' }}>
                              {city.windSpeed !== undefined && !isNaN(city.windSpeed) 
                                ? `${convertWind(city.windSpeed)} ${formatWindSpeedUnit(settings.windSpeed)}` 
                                : `0 ${formatWindSpeedUnit(settings.windSpeed)}`}
                            </span>
                          </div>
                          {city.humidity !== undefined && !isNaN(city.humidity) && (
                            <div>
                              <span style={{ color: 'var(--gray)' }}>Humidity: </span>
                              <span style={{ color: 'var(--fg)' }}>{city.humidity}%</span>
                            </div>
                          )}
                          {city.visibility !== undefined && !isNaN(city.visibility) && city.visibility > 0 && (
                            <div>
                              <span style={{ color: 'var(--gray)' }}>Visibility: </span>
                              <span style={{ color: 'var(--fg)' }}>{convertVis(city.visibility)} {getDistanceUnit()}</span>
                    </div>
                          )}
                  </div>
                  </motion.div>
              )}
            </Card>
            </motion.div>

            {/* Add Button */}
            <motion.button
              onClick={() => {
                handleSaveCity(city.cityId);
                setSwipeDistance((prev) => ({ ...prev, [city.cityId]: 0 }));
              }}
              className="absolute right-0 flex-shrink-0 p-5 rounded-[15px] h-[100px] w-20 flex items-center justify-center"
              style={{ 
                backgroundColor: 'var(--green)', 
                color: 'var(--bg-0)'
              }}
              animate={{
                opacity: showAdd ? 1 : 0,
                scale: showAdd ? 1 : 0.8,
              }}
              transition={{
                type: "spring",
                damping: 20,
                stiffness: 300,
              }}
              whileTap={{ scale: 0.95 }}
            >
              <IoAddSharp size={35} />
            </motion.button>
          </div>
        );
      })}
        </div>
  );
};

export default CityCard;
