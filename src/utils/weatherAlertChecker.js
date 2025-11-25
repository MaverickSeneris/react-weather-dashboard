import { getWeatherAlerts } from "./weatherRecommendations";

/**
 * Check if weather data has severe weather alerts
 * @param {Object} weatherData - Weather data object
 * @returns {Object} - { hasSevere: boolean, alertType: 'danger' | 'warning' | null, alerts: Array }
 */
export const checkSevereWeather = (weatherData) => {
  if (!weatherData || !weatherData.current) {
    return { hasSevere: false, alertType: null, alerts: [] };
  }

  const alerts = getWeatherAlerts(weatherData);
  
  if (alerts.length === 0) {
    return { hasSevere: false, alertType: null, alerts: [] };
  }

  // Check if there are any danger-level alerts
  const hasDanger = alerts.some(alert => alert.type === "danger");
  const hasWarning = alerts.some(alert => alert.type === "warning");

  return {
    hasSevere: true,
    alertType: hasDanger ? "danger" : hasWarning ? "warning" : null,
    alerts: alerts,
  };
};

/**
 * Get travel-relevant weather data
 * @param {Object} weatherData - Weather data object
 * @returns {Object} - Travel-relevant weather information
 */
export const getTravelWeatherData = (weatherData) => {
  if (!weatherData || !weatherData.current) {
    return null;
  }

  const { current, daily, hourly } = weatherData;
  const alerts = getWeatherAlerts(weatherData);

  return {
    current: {
      temperature: current.temperature,
      feelsLike: current.feelsLike,
      description: current.description,
      uvIndex: current.uvIndex,
      windSpeed: current.windSpeed,
      chanceOfRain: current.chanceOfRain,
      humidity: current.humidity,
      visibility: current.visibility,
      pressure: current.pressure,
    },
    alerts: alerts,
    daily: daily?.slice(0, 3) || [], // Next 3 days
    hourly: hourly || null,
  };
};

