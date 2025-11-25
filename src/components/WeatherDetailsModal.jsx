import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card from "./ui/Card";
import { getTravelWeatherData } from "../utils/weatherAlertChecker";
import { useWeatherSettings } from "../utils/hooks/useWeatherSettings";
import { IoClose } from "react-icons/io5";

function WeatherDetailsModal({ isOpen, onClose, weatherData, cityName, inline = false }) {
  const { settings } = useWeatherSettings();
  const travelData = weatherData ? getTravelWeatherData(weatherData) : null;

  if (!travelData) return null;

  const convertTemp = (temp) => {
    return settings.temperature === "Fahrenheit"
      ? Math.round((temp * 9) / 5 + 32)
      : Math.round(temp);
  };

  const convertWind = (speed) => {
    if (settings.windSpeed === "mph") return (speed * 2.237).toFixed(1);
    if (settings.windSpeed === "m/s") return speed.toFixed(1);
    if (settings.windSpeed === "Knots") return (speed * 1.944).toFixed(1);
    return (speed * 3.6).toFixed(1); // km/h
  };

  const getAlertColor = (type) => {
    return type === "danger" ? "var(--red)" : "var(--yellow)";
  };

  // If used inline, render without backdrop and modal wrapper
  if (inline) {
    return (
      <div className="w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold" style={{ color: 'var(--fg)' }}>
            {cityName} - Weather Details
          </h3>
        </div>

              {/* Weather Alerts */}
              {travelData.alerts && travelData.alerts.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--fg)' }}>
                    ⚠️ Weather Warnings
                  </h3>
                  <div className="space-y-2">
                    {travelData.alerts.map((alert, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-3 rounded-lg border-2"
                        style={{
                          borderColor: getAlertColor(alert.type),
                          backgroundColor: `${getAlertColor(alert.type)}15`,
                        }}
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-xl">{alert.icon}</span>
                          <div className="flex-1">
                            <h4 className="font-bold text-sm mb-1" style={{ color: getAlertColor(alert.type) }}>
                              {alert.title}
                            </h4>
                            <p className="text-xs opacity-90">{alert.message}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Current Conditions */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--fg)' }}>
                  Current Conditions
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-2)' }}>
                    <p className="text-xs mb-1" style={{ color: 'var(--gray)' }}>Temperature</p>
                    <p className="text-xl font-bold" style={{ color: 'var(--fg)' }}>
                      {convertTemp(travelData.current.temperature)}°
                    </p>
                    <p className="text-xs" style={{ color: 'var(--gray)' }}>
                      Feels like {convertTemp(travelData.current.feelsLike)}°
                    </p>
                  </div>
                  <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-2)' }}>
                    <p className="text-xs mb-1" style={{ color: 'var(--gray)' }}>UV Index</p>
                    <p className="text-xl font-bold" style={{ color: 'var(--fg)' }}>
                      {travelData.current.uvIndex}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--gray)' }}>
                      {travelData.current.uvIndex >= 8 ? "Very High" : travelData.current.uvIndex >= 6 ? "High" : "Moderate"}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-2)' }}>
                    <p className="text-xs mb-1" style={{ color: 'var(--gray)' }}>Wind Speed</p>
                    <p className="text-xl font-bold" style={{ color: 'var(--fg)' }}>
                      {convertWind(travelData.current.windSpeed)} {settings.windSpeed || "km/h"}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-2)' }}>
                    <p className="text-xs mb-1" style={{ color: 'var(--gray)' }}>Rain Chance</p>
                    <p className="text-xl font-bold" style={{ color: 'var(--fg)' }}>
                      {travelData.current.chanceOfRain}%
                    </p>
                  </div>
                  {travelData.current.visibility && (
                    <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-2)' }}>
                      <p className="text-xs mb-1" style={{ color: 'var(--gray)' }}>Visibility</p>
                      <p className="text-xl font-bold" style={{ color: 'var(--fg)' }}>
                        {(travelData.current.visibility / 1000).toFixed(1)} km
                      </p>
                    </div>
                  )}
                  <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-2)' }}>
                    <p className="text-xs mb-1" style={{ color: 'var(--gray)' }}>Humidity</p>
                    <p className="text-xl font-bold" style={{ color: 'var(--fg)' }}>
                      {travelData.current.humidity}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Travel Recommendations */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--fg)' }}>
                  Travel Recommendations
                </h3>
                <div className="space-y-2">
                  {travelData.current.chanceOfRain > 50 && (
                    <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-2)' }}>
                      <p className="text-sm" style={{ color: 'var(--fg)' }}>
                        🌧️ High chance of rain - Bring umbrella and waterproof gear
                      </p>
                    </div>
                  )}
                  {travelData.current.uvIndex >= 8 && (
                    <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-2)' }}>
                      <p className="text-sm" style={{ color: 'var(--fg)' }}>
                        ☀️ Very high UV - Use sunscreen, wear hat and sunglasses
                      </p>
                    </div>
                  )}
                  {travelData.current.windSpeed > 15 && (
                    <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-2)' }}>
                      <p className="text-sm" style={{ color: 'var(--fg)' }}>
                        💨 Strong winds - Secure loose items, be cautious outdoors
                      </p>
                    </div>
                  )}
                  {travelData.current.temperature > 35 && (
                    <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-2)' }}>
                      <p className="text-sm" style={{ color: 'var(--fg)' }}>
                        🌡️ Hot weather - Stay hydrated, avoid direct sun, seek shade
                      </p>
                    </div>
                  )}
                  {travelData.current.temperature < 0 && (
                    <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-2)' }}>
                      <p className="text-sm" style={{ color: 'var(--fg)' }}>
                        ❄️ Freezing temperatures - Dress warmly, limit outdoor exposure
                      </p>
                    </div>
                  )}
                  {travelData.current.visibility && travelData.current.visibility < 1000 && (
                    <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-2)' }}>
                      <p className="text-sm" style={{ color: 'var(--fg)' }}>
                        🌫️ Low visibility - Drive carefully, use fog lights
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Next 3 Days Forecast */}
              {travelData.daily && travelData.daily.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--fg)' }}>
                    Next 3 Days Forecast
                  </h3>
                  <div className="space-y-2">
                    {travelData.daily.map((day, index) => (
                      <div
                        key={index}
                        className="p-3 rounded-lg flex items-center justify-between"
                        style={{ backgroundColor: 'var(--bg-2)' }}
                      >
                        <div>
                          <p className="font-semibold" style={{ color: 'var(--fg)' }}>{day.day}</p>
                          <p className="text-xs" style={{ color: 'var(--gray)' }}>{day.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold" style={{ color: 'var(--fg)' }}>
                            {convertTemp(day.tempHigh)}° / {convertTemp(day.tempLow)}°
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
      </div>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-h-[85vh] overflow-y-auto"
          >
            <Card className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold" style={{ color: 'var(--fg)' }}>
                  {cityName} - Weather Details
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-var(--bg-2) transition-colors"
                  style={{ color: 'var(--fg)' }}
                >
                  <IoClose size={24} />
                </button>
              </div>

              {/* Weather Alerts */}
              {travelData.alerts && travelData.alerts.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--fg)' }}>
                    ⚠️ Weather Warnings
                  </h3>
                  <div className="space-y-2">
                    {travelData.alerts.map((alert, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-3 rounded-lg border-2"
                        style={{
                          borderColor: getAlertColor(alert.type),
                          backgroundColor: `${getAlertColor(alert.type)}15`,
                        }}
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-xl">{alert.icon}</span>
                          <div className="flex-1">
                            <h4 className="font-bold text-sm mb-1" style={{ color: getAlertColor(alert.type) }}>
                              {alert.title}
                            </h4>
                            <p className="text-xs opacity-90">{alert.message}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Current Conditions */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--fg)' }}>
                  Current Conditions
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-2)' }}>
                    <p className="text-xs mb-1" style={{ color: 'var(--gray)' }}>Temperature</p>
                    <p className="text-xl font-bold" style={{ color: 'var(--fg)' }}>
                      {convertTemp(travelData.current.temperature)}°
                    </p>
                    <p className="text-xs" style={{ color: 'var(--gray)' }}>
                      Feels like {convertTemp(travelData.current.feelsLike)}°
                    </p>
                  </div>
                  <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-2)' }}>
                    <p className="text-xs mb-1" style={{ color: 'var(--gray)' }}>UV Index</p>
                    <p className="text-xl font-bold" style={{ color: 'var(--fg)' }}>
                      {travelData.current.uvIndex}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--gray)' }}>
                      {travelData.current.uvIndex >= 8 ? "Very High" : travelData.current.uvIndex >= 6 ? "High" : "Moderate"}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-2)' }}>
                    <p className="text-xs mb-1" style={{ color: 'var(--gray)' }}>Wind Speed</p>
                    <p className="text-xl font-bold" style={{ color: 'var(--fg)' }}>
                      {convertWind(travelData.current.windSpeed)} {settings.windSpeed || "km/h"}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-2)' }}>
                    <p className="text-xs mb-1" style={{ color: 'var(--gray)' }}>Rain Chance</p>
                    <p className="text-xl font-bold" style={{ color: 'var(--fg)' }}>
                      {travelData.current.chanceOfRain}%
                    </p>
                  </div>
                  {travelData.current.visibility && (
                    <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-2)' }}>
                      <p className="text-xs mb-1" style={{ color: 'var(--gray)' }}>Visibility</p>
                      <p className="text-xl font-bold" style={{ color: 'var(--fg)' }}>
                        {(travelData.current.visibility / 1000).toFixed(1)} km
                      </p>
                    </div>
                  )}
                  <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-2)' }}>
                    <p className="text-xs mb-1" style={{ color: 'var(--gray)' }}>Humidity</p>
                    <p className="text-xl font-bold" style={{ color: 'var(--fg)' }}>
                      {travelData.current.humidity}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Travel Recommendations */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--fg)' }}>
                  Travel Recommendations
                </h3>
                <div className="space-y-2">
                  {travelData.current.chanceOfRain > 50 && (
                    <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-2)' }}>
                      <p className="text-sm" style={{ color: 'var(--fg)' }}>
                        🌧️ High chance of rain - Bring umbrella and waterproof gear
                      </p>
                    </div>
                  )}
                  {travelData.current.uvIndex >= 8 && (
                    <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-2)' }}>
                      <p className="text-sm" style={{ color: 'var(--fg)' }}>
                        ☀️ Very high UV - Use sunscreen, wear hat and sunglasses
                      </p>
                    </div>
                  )}
                  {travelData.current.windSpeed > 15 && (
                    <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-2)' }}>
                      <p className="text-sm" style={{ color: 'var(--fg)' }}>
                        💨 Strong winds - Secure loose items, be cautious outdoors
                      </p>
                    </div>
                  )}
                  {travelData.current.temperature > 35 && (
                    <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-2)' }}>
                      <p className="text-sm" style={{ color: 'var(--fg)' }}>
                        🌡️ Hot weather - Stay hydrated, avoid direct sun, seek shade
                      </p>
                    </div>
                  )}
                  {travelData.current.temperature < 0 && (
                    <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-2)' }}>
                      <p className="text-sm" style={{ color: 'var(--fg)' }}>
                        ❄️ Freezing temperatures - Dress warmly, limit outdoor exposure
                      </p>
                    </div>
                  )}
                  {travelData.current.visibility && travelData.current.visibility < 1000 && (
                    <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-2)' }}>
                      <p className="text-sm" style={{ color: 'var(--fg)' }}>
                        🌫️ Low visibility - Drive carefully, use fog lights
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Next 3 Days Forecast */}
              {travelData.daily && travelData.daily.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--fg)' }}>
                    Next 3 Days Forecast
                  </h3>
                  <div className="space-y-2">
                    {travelData.daily.map((day, index) => (
                      <div
                        key={index}
                        className="p-3 rounded-lg flex items-center justify-between"
                        style={{ backgroundColor: 'var(--bg-2)' }}
                      >
                        <div>
                          <p className="font-semibold" style={{ color: 'var(--fg)' }}>{day.day}</p>
                          <p className="text-xs" style={{ color: 'var(--gray)' }}>{day.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold" style={{ color: 'var(--fg)' }}>
                            {convertTemp(day.tempHigh)}° / {convertTemp(day.tempLow)}°
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default WeatherDetailsModal;

