import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import SearchBar from "../components/SearchBar";
import Header from "../components/ui/Header";
import PageContainer from "../components/ui/PageContainer";
import FloatingRefreshButton from "../components/ui/FloatingRefreshButton";
import Card from "../components/ui/Card";
import formatTime from "../utils/timeFormatter";
import { IoCloseSharp, IoArrowUndo, IoChevronDown } from "react-icons/io5";
import { Link } from "react-router";
import axios from "axios";
import getDayLabel from "../utils/dayLabel";
import { useWeatherSettings } from "../utils/hooks/useWeatherSettings";
import { checkSevereWeather } from "../utils/weatherAlertChecker";
import { convertTemperature, convertWindSpeed, convertDistance } from "../utils/unitConverter";

const key = import.meta.env.VITE_OPENWEATHER_API_KEY;
const url = import.meta.env.VITE_OPENWEATHER_ONECALL_API_URL;

// Regular City Card Component (non-sortable, for swipe-to-delete only)
function RegularCityCard({
  city,
  isDragging,
  currentSwipeDistance,
  clampedSwipe,
  showDelete,
  swipeThreshold,
  maxSwipe,
  severeWeather,
  borderColor,
  expandedCards,
  setExpandedCards,
  setDraggedId,
  setTouchStartX,
  setSwipeDistance,
  handleDelete,
  convertTemp,
  convertWind,
  convertVis,
  getDistanceUnit,
  formatWindSpeedUnit,
  settings,
  touchStartX
}) {
  return (
    <div className="relative flex items-center w-full select-none touch-none">
      <div
        className="w-full select-none touch-none"
        onTouchStart={(e) => {
          setDraggedId(city.cityId);
          setTouchStartX(e.touches[0].clientX);
        }}
        onTouchMove={(e) => {
          if (!isDragging) return;
          const touchX = e.touches[0].clientX;
          const deltaX = touchStartX - touchX;
          
          if (deltaX > 0) {
            setSwipeDistance(deltaX);
          } else {
            setSwipeDistance(0);
          }
        }}
        onTouchEnd={() => {
          if (currentSwipeDistance < swipeThreshold) {
            setSwipeDistance(0);
          } else {
            setSwipeDistance(maxSwipe);
          }
        }}
        style={{ touchAction: 'pan-y' }}
      >
        <motion.div
          className="flex-grow select-none touch-none"
          animate={{ x: -clampedSwipe }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          style={{ willChange: 'transform' }}
        >
          <Card compact={true} style={{ borderLeft: severeWeather.hasSevere ? `4px solid ${borderColor}` : undefined }}>
            <div className="flex justify-between">
              <Link
                to={`/test/${city.cityId || "unknown"}`}
                state={{ currentWeatherInfo: city, cityName: city.name }}
                className="flex flex-col justify-between"
                style={{ color: 'var(--fg)' }}
              >
                <h2 className="font-bold text-xl">{city.name}</h2>
                <span className="text-xs font-bold" style={{ color: 'var(--gray)' }}>
                  {(() => {
                    try {
                      if (!city.time || isNaN(city.time)) return '';
                      const timezoneOffset = (city.timezoneOffset !== undefined && !isNaN(city.timezoneOffset))
                        ? city.timezoneOffset 
                        : (city.lon && !isNaN(city.lon)) 
                          ? Math.round((city.lon / 15) * 3600)
                          : 0;
                      const utcDate = new Date(city.time * 1000);
                      if (isNaN(utcDate.getTime())) return '';
                      let hours = utcDate.getUTCHours();
                      let minutes = utcDate.getUTCMinutes();
                      const offsetHours = Math.floor(timezoneOffset / 3600);
                      const offsetMinutes = Math.floor((timezoneOffset % 3600) / 60);
                      hours = hours + offsetHours;
                      minutes = minutes + offsetMinutes;
                      if (minutes >= 60) { hours += 1; minutes -= 60; }
                      else if (minutes < 0) { hours -= 1; minutes += 60; }
                      if (hours >= 24) { hours -= 24; }
                      else if (hours < 0) { hours += 24; }
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
                </span>
              </Link>
              <div>
                <span className="text-4xl font-regular">
                  {city.temperature !== undefined && !isNaN(city.temperature) 
                    ? `${convertTemp(city.temperature)}°` 
                    : 'N/A'}
                </span>
              </div>
            </div>
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
                style={{ color: severeWeather.hasSevere ? borderColor : 'var(--gray)' }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                animate={{ rotate: expandedCards.has(city.cityId) ? 180 : 0 }}
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
                {severeWeather.hasSevere && severeWeather.alerts && severeWeather.alerts.length > 0 && (
                  <div className="mb-3 space-y-1.5">
                    {severeWeather.alerts.map((alert, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-2 rounded text-xs border"
                        style={{
                          borderColor: alert.type === "danger" ? "var(--red)" : "var(--yellow)",
                          backgroundColor: alert.type === "danger" ? "var(--red)15" : "var(--yellow)15",
                        }}
                      >
                        <div className="flex items-start gap-1.5">
                          <span className="text-sm">{alert.icon}</span>
                          <div className="flex-1">
                            <span 
                              className="font-semibold"
                              style={{ color: alert.type === "danger" ? "var(--red)" : "var(--yellow)" }}
                            >
                              {alert.title}:{" "}
                            </span>
                            <span style={{ color: 'var(--fg)' }}>{alert.message}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span style={{ color: 'var(--gray)' }}>Feels like: </span>
                    <span style={{ color: 'var(--fg)' }}>{convertTemp(city.feelsLike)}°</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--gray)' }}>Rain: </span>
                    <span style={{ color: 'var(--fg)' }}>{city.chanceOfRain}%</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--gray)' }}>UV Index: </span>
                    <span style={{ color: 'var(--fg)' }}>{city.uvIndex}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--gray)' }}>Wind: </span>
                    <span style={{ color: 'var(--fg)' }}>{convertWind(city.windSpeed || 0)} {formatWindSpeedUnit(settings.windSpeed)}</span>
                  </div>
                  {city.humidity && (
                    <div>
                      <span style={{ color: 'var(--gray)' }}>Humidity: </span>
                      <span style={{ color: 'var(--fg)' }}>{city.humidity}%</span>
                    </div>
                  )}
                  {city.visibility && (
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
        <motion.button
          onClick={() => {
            handleDelete(city.cityId);
            setSwipeDistance(0);
          }}
          className="absolute right-0 top-0 bottom-0 flex-shrink-0 p-5 rounded-[15px] w-20 flex items-center justify-center"
          style={{ backgroundColor: 'var(--red)', color: 'var(--bg-0)' }}
          animate={{ opacity: showDelete ? 1 : 0, scale: showDelete ? 1 : 0.8 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          whileTap={{ scale: 0.95 }}
        >
          <IoCloseSharp size={35} />
        </motion.button>
      </div>
    </div>
  );
}

// Sortable City Card Component
function SortableCityCard({ 
  city, 
  isDragging, 
  currentSwipeDistance, 
  clampedSwipe, 
  showDelete, 
  swipeThreshold, 
  maxSwipe,
  severeWeather,
  borderColor,
  expandedCards,
  setExpandedCards,
  setDraggedId,
  setTouchStartX,
  setSwipeDistance,
  handleDelete,
  convertTemp,
  convertWind,
  convertVis,
  getDistanceUnit,
  formatWindSpeedUnit,
  settings,
  touchStartX,
  touchStartRef,
  dragModeCardId,
  setDragModeCardId
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: city.cityId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isSortableDragging ? undefined : transition, // Disable transition during drag for snappier feel
    opacity: isSortableDragging ? 0.6 : 1, // Slightly more visible when dragging
    cursor: isSortableDragging ? 'grabbing' : 'grab',
  };

  const longPressTimerRef = useRef(null);
  const touchStartTimeRef = useRef(0);
  const hasMovedRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, isVertical: null });

  // Only enable drag listeners if this card is in drag mode
  const shouldEnableDrag = dragModeCardId === city.cityId;

  // Custom listeners that only work when drag mode is enabled
  const customListeners = shouldEnableDrag ? {
    ...listeners,
    onPointerDown: (e) => {
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        isVertical: null
      };
      if (listeners?.onPointerDown) {
        listeners.onPointerDown(e);
      }
    },
    onPointerMove: (e) => {
      if (dragStartRef.current.isVertical === null) {
        const deltaX = Math.abs(e.clientX - dragStartRef.current.x);
        const deltaY = Math.abs(e.clientY - dragStartRef.current.y);
        
        if (deltaY > deltaX && deltaY > 5) { // Reduced threshold for snappier detection
          dragStartRef.current.isVertical = true;
        } else if (deltaX > deltaY && deltaX > 5) {
          dragStartRef.current.isVertical = false;
          return;
        }
      }
      
      if (dragStartRef.current.isVertical && listeners?.onPointerMove) {
        listeners.onPointerMove(e);
      }
    }
  } : {};

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative flex items-center w-full select-none touch-none" // Removed transition for snappier drag
      {...attributes}
      {...customListeners}
    >
      {/* Inner container for swipe-to-delete - wider drag area */}
      <div
        className="w-full min-h-[80px] select-none touch-none" // Increased minimum height for easier drag trigger
        onTouchStart={(e) => {
          touchStartTimeRef.current = Date.now();
          hasMovedRef.current = false;
          
          touchStartRef.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
            cityId: city.cityId
          };
          dragStartRef.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
            isVertical: null
          };
          
          // Start long press timer (reduced to 800ms for snappier response)
          longPressTimerRef.current = setTimeout(() => {
            if (!hasMovedRef.current) {
              setDragModeCardId(city.cityId);
            }
          }, 800); // 0.8 seconds - faster activation
        }}
        onTouchMove={(e) => {
          if (isSortableDragging && shouldEnableDrag) return;
          
          const currentX = e.touches[0].clientX;
          const currentY = e.touches[0].clientY;
          const deltaX = Math.abs(currentX - touchStartRef.current.x);
          const deltaY = Math.abs(currentY - touchStartRef.current.y);
          
          // Check if user has moved significantly (reduced threshold for snappier response)
          if (deltaX > 8 || deltaY > 8) {
            hasMovedRef.current = true;
            // Cancel long press if user is swiping horizontally
            if (deltaX > deltaY && deltaX > 8) {
              if (longPressTimerRef.current) {
                clearTimeout(longPressTimerRef.current);
                longPressTimerRef.current = null;
              }
            }
          }
          
          // Only allow swipe-to-delete if not in drag mode
          if (!shouldEnableDrag) {
            if (dragStartRef.current.isVertical === null) {
              if (deltaY > deltaX && deltaY > 5) { // Reduced threshold for snappier detection
                dragStartRef.current.isVertical = true;
                return;
              } else if (deltaX > deltaY && deltaX > 5) {
                dragStartRef.current.isVertical = false;
              }
            }
            
            if (dragStartRef.current.isVertical === false) {
              if (!isDragging) {
                setDraggedId(city.cityId);
                setTouchStartX(touchStartRef.current.x);
              }
              const swipeDelta = touchStartRef.current.x - currentX;
              if (swipeDelta > 0) {
                setSwipeDistance(swipeDelta);
              } else {
                setSwipeDistance(0);
              }
            }
          }
        }}
        onTouchEnd={() => {
          // Clear long press timer
          if (longPressTimerRef.current) {
            clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
          }
          
          // If in drag mode, reset it immediately for snappier response
          if (shouldEnableDrag) {
            setDragModeCardId(null);
            dragStartRef.current = { x: 0, y: 0, isVertical: null };
            return;
          }
          
          if (currentSwipeDistance < swipeThreshold) {
            setSwipeDistance(0);
          } else {
            setSwipeDistance(maxSwipe);
          }
          touchStartRef.current = { x: 0, y: 0, cityId: null };
          dragStartRef.current = { x: 0, y: 0, isVertical: null };
        }}
        style={{ touchAction: (isSortableDragging && shouldEnableDrag) ? 'none' : 'pan-y' }}
      >
        {/* Card */}
        <motion.div
          className="flex-grow select-none touch-none"
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
            <div className="flex justify-between">
              <Link
                to={`/test/${city.cityId || "unknown"}`}
                state={{
                  currentWeatherInfo: city,
                  cityName: city.name,
                }}
                className="flex flex-col justify-between"
                style={{ color: 'var(--fg)' }}
              >
                <h2 className="font-bold text-xl">{city.name}</h2>
                <span className="text-xs font-bold" style={{ color: 'var(--gray)' }}>
                  {(() => {
                    try {
                      if (!city.time || isNaN(city.time)) return '';
                      
                      const timezoneOffset = (city.timezoneOffset !== undefined && !isNaN(city.timezoneOffset))
                        ? city.timezoneOffset 
                        : (city.lon && !isNaN(city.lon)) 
                          ? Math.round((city.lon / 15) * 3600)
                          : 0;
                      
                      const utcDate = new Date(city.time * 1000);
                      
                      if (isNaN(utcDate.getTime())) return '';
                      
                      let hours = utcDate.getUTCHours();
                      let minutes = utcDate.getUTCMinutes();
                      
                      const offsetHours = Math.floor(timezoneOffset / 3600);
                      const offsetMinutes = Math.floor((timezoneOffset % 3600) / 60);
                      
                      hours = hours + offsetHours;
                      minutes = minutes + offsetMinutes;
                      
                      if (minutes >= 60) {
                        hours += 1;
                        minutes -= 60;
                      } else if (minutes < 0) {
                        hours -= 1;
                        minutes += 60;
                      }
                      
                      if (hours >= 24) {
                        hours -= 24;
                      } else if (hours < 0) {
                        hours += 24;
                      }
                      
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
                </span>
              </Link>
              <div>
                <span className="text-4xl font-regular">
                  {city.temperature !== undefined && !isNaN(city.temperature) 
                    ? `${convertTemp(city.temperature)}°` 
                    : 'N/A'}
                </span>
              </div>
            </div>
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
                {/* Weather Alerts */}
                {severeWeather.hasSevere && severeWeather.alerts && severeWeather.alerts.length > 0 && (
                  <div className="mb-3 space-y-1.5">
                    {severeWeather.alerts.map((alert, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-2 rounded text-xs border"
                        style={{
                          borderColor: alert.type === "danger" ? "var(--red)" : "var(--yellow)",
                          backgroundColor: alert.type === "danger" ? "var(--red)15" : "var(--yellow)15",
                        }}
                      >
                        <div className="flex items-start gap-1.5">
                          <span className="text-sm">{alert.icon}</span>
                          <div className="flex-1">
                            <span 
                              className="font-semibold"
                              style={{ 
                                color: alert.type === "danger" ? "var(--red)" : "var(--yellow)" 
                              }}
                            >
                              {alert.title}:{" "}
                            </span>
                            <span style={{ color: 'var(--fg)' }}>{alert.message}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
                
                {/* Weather Data */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span style={{ color: 'var(--gray)' }}>Feels like: </span>
                    <span style={{ color: 'var(--fg)' }}>{convertTemp(city.feelsLike)}°</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--gray)' }}>Rain: </span>
                    <span style={{ color: 'var(--fg)' }}>{city.chanceOfRain}%</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--gray)' }}>UV Index: </span>
                    <span style={{ color: 'var(--fg)' }}>{city.uvIndex}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--gray)' }}>Wind: </span>
                    <span style={{ color: 'var(--fg)' }}>{convertWind(city.windSpeed || 0)} {formatWindSpeedUnit(settings.windSpeed)}</span>
                  </div>
                  {city.humidity && (
                    <div>
                      <span style={{ color: 'var(--gray)' }}>Humidity: </span>
                      <span style={{ color: 'var(--fg)' }}>{city.humidity}%</span>
                    </div>
                  )}
                  {city.visibility && (
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

        {/* Delete Button */}
        <motion.button
          onClick={() => {
            handleDelete(city.cityId);
            setSwipeDistance(0);
          }}
          className="absolute right-0 top-0 bottom-0 flex-shrink-0 p-5 rounded-[15px] w-20 flex items-center justify-center"
          style={{ 
            backgroundColor: 'var(--red)', 
            color: 'var(--bg-0)'
          }}
          animate={{
            opacity: showDelete ? 1 : 0,
            scale: showDelete ? 1 : 0.8,
          }}
          transition={{
            type: "spring",
            damping: 20,
            stiffness: 300,
          }}
          whileTap={{ scale: 0.95 }}
        >
          <IoCloseSharp size={35} />
        </motion.button>
      </div>
    </div>
  );
}

function CityList() {
  const [searchMode, setSearchMode] = useState(false);
  const [favoriteCities, setFavoriteCities] = useState([]);
  const { settings } = useWeatherSettings();
  // Undo feature state
  const [deletedCity, setDeletedCity] = useState(null);
  const [undoTimeout, setUndoTimeout] = useState(null);

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
  // Track the city being dragged/swiped
  const [draggedId, setDraggedId] = useState(null);
  const [swipeDistance, setSwipeDistance] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  // Expanded cards state
  const [expandedCards, setExpandedCards] = useState(new Set());
  const [lastUpdateTime, setLastUpdateTime] = useState(null);
  // Track which card is in drag mode (activated by long press)
  const [dragModeCardId, setDragModeCardId] = useState(null);

  // Load initial data from localStorage on mount and listen for updates
  useEffect(() => {
    const loadCities = () => {
      try {
        const stored = JSON.parse(localStorage.getItem("savedCities")) || [];
        setFavoriteCities(stored);
      } catch (error) {
        console.error("Error loading cities from localStorage:", error);
        setFavoriteCities([]);
      }
    };

    loadCities();

    // Listen for storage events (when city is added from search)
    const handleStorageChange = () => {
      loadCities();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom event (for same-tab updates)
    window.addEventListener('cityAdded', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cityAdded', handleStorageChange);
    };
  }, []);

  // Fetch weather data function
    const fetchLiveWeatherData = async () => {
    setIsRefreshing(true);
      const stored = JSON.parse(localStorage.getItem("savedCities")) || [];

    if (stored.length === 0) {
      setIsRefreshing(false);
      return;
    }

      const updatedCities = await Promise.all(
        stored.map(async (city) => {
          const { lat, lon, name, cityId } = city;

          try {
          if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
            console.error(`Invalid coordinates for ${name}:`, { lat, lon });
            return city;
          }

            const res = await axios.get(url, {
              params: {
                lat,
                lon,
                appid: key,
                units: "metric",
              },
            });

            const data = res.data;

          if (!data || !data.current) {
            throw new Error("Invalid weather data received");
          }

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

          // Get timezone offset from API (in seconds from UTC), or calculate from longitude
          // OpenWeather API provides timezone_offset, otherwise approximate from longitude
          const timezoneOffset = (data.timezone_offset !== undefined && !isNaN(data.timezone_offset))
            ? data.timezone_offset 
            : (!isNaN(lon)) 
              ? Math.round((lon / 15) * 3600)
              : 0;

            const updatedCity = {
              ...city,
            temperature: Math.floor(data.current.temp || 0),
            condition: data.current.weather?.[0]?.main?.toLowerCase() || "unknown",
            weatherIcon: data.current.weather?.[0]?.icon || "01d",
            time: data.current.dt || Math.floor(Date.now() / 1000),
            timezoneOffset: timezoneOffset, // Store timezone offset for local time calculation
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

            console.log(`Fetched weather data for ${name}:`, updatedCity);
            return updatedCity;
          } catch (err) {
          console.error(`Error fetching weather for ${name}:`, err.message || err);
          // Return city with default values to prevent NaN
          return {
            ...city,
            temperature: city.temperature || 0,
            time: city.time || Math.floor(Date.now() / 1000),
            timezoneOffset: city.timezoneOffset || (city.lon ? Math.round((city.lon / 15) * 3600) : 0),
            uvIndex: city.uvIndex || 0,
            windSpeed: city.windSpeed || 0,
            humidity: city.humidity || 0,
            feelsLike: city.feelsLike || 0,
            chanceOfRain: city.chanceOfRain || 0,
          };
          }
        })
      );

      setFavoriteCities(updatedCities);
    localStorage.setItem("savedCities", JSON.stringify(updatedCities));
      console.log("Updated favoriteCities state:", updatedCities);
    
    // Set last update time
    const updateTime = new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: settings.timeFormat === "12 Hour",
    });
    setLastUpdateTime(updateTime);
    localStorage.setItem("lastCityListUpdateTime", updateTime);
    
    setIsRefreshing(false);
  };


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
    setSwipeDistance(0);
    setTouchStartX(0);

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

  // Drag and drop handlers
  // Track initial touch position to determine direction
  const touchStartRef = useRef({ x: 0, y: 0, cityId: null });

  // Custom sensor that only activates for vertical drag
  const verticalDragSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 3, // Reduced from 8 to 3 for easier activation
      delay: 0,
      tolerance: 3, // Reduced tolerance for snappier response
    },
  });

  const sensors = useSensors(verticalDragSensor);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setFavoriteCities((items) => {
        const oldIndex = items.findIndex((item) => item.cityId === active.id);
        const newIndex = items.findIndex((item) => item.cityId === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        localStorage.setItem("savedCities", JSON.stringify(newItems));
        return newItems;
      });
    }
  };

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
      {/* Floating Refresh Button */}
      {!searchMode && (
        <FloatingRefreshButton
          onClick={fetchLiveWeatherData}
          isRefreshing={isRefreshing}
          disabled={false}
        />
      )}

      {/* Header */}
      {!searchMode && (
        <Header title={"My Cities"} />
      )}

      {/* Search */}
      {searchMode ? (
        <SearchBar toggleSearchMode={toggleSearchMode} />
      ) : (
        <>
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
          {lastUpdateTime && (
            <p className="flex justify-center text-xs mt-1" style={{ color: 'var(--gray)' }}>
              Last updated: {lastUpdateTime}
            </p>
          )}
        </>
      )}

      {/* Favorite City Cards */}
      {!searchMode && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={favoriteCities.map(city => city.cityId)}
            strategy={verticalListSortingStrategy}
          >
            <div className="mt-6 space-y-1">
              {favoriteCities.map((city) => {
                const isDragging = draggedId === city.cityId;
                const currentSwipeDistance = isDragging ? swipeDistance : 0;
                const deleteButtonWidth = 80;
                const swipeThreshold = 50;
                const maxSwipe = deleteButtonWidth + 20;
                
                const showDelete = currentSwipeDistance > swipeThreshold;
                const clampedSwipe = Math.min(Math.max(currentSwipeDistance, 0), maxSwipe);

                const cityWeatherData = {
                  current: {
                    temperature: city.temperature || 0,
                    feelsLike: city.feelsLike || 0,
                    uvIndex: city.uvIndex || 0,
                    chanceOfRain: city.chanceOfRain || 0,
                    windSpeed: city.windSpeed || 0,
                    description: city.condition || "unknown",
                    visibility: city.visibility || null,
                    humidity: city.humidity || 0,
                  },
                };
                const severeWeather = checkSevereWeather(cityWeatherData);
                const borderColor = severeWeather.hasSevere
                  ? severeWeather.alertType === "danger"
                    ? "var(--red)"
                    : "var(--yellow)"
                  : "transparent";

                return (
                  <SortableCityCard
                    key={city.cityId}
                    city={city}
                    isDragging={isDragging}
                    currentSwipeDistance={currentSwipeDistance}
                    clampedSwipe={clampedSwipe}
                    showDelete={showDelete}
                    swipeThreshold={swipeThreshold}
                    maxSwipe={maxSwipe}
                    severeWeather={severeWeather}
                    borderColor={borderColor}
                    expandedCards={expandedCards}
                    setExpandedCards={setExpandedCards}
                    setDraggedId={setDraggedId}
                    setTouchStartX={setTouchStartX}
                    setSwipeDistance={setSwipeDistance}
                    handleDelete={handleDelete}
                    convertTemp={convertTemp}
                    convertWind={convertWind}
                    convertVis={convertVis}
                    getDistanceUnit={getDistanceUnit}
                    formatWindSpeedUnit={formatWindSpeedUnit}
                    settings={settings}
                    touchStartX={touchStartX}
                    touchStartRef={touchStartRef}
                    dragModeCardId={dragModeCardId}
                    setDragModeCardId={setDragModeCardId}
                  />
                );
              })}
            </div>
          </SortableContext>
        </DndContext>
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
