import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card from "./ui/Card";
import { getWeatherAlerts } from "../utils/weatherRecommendations";
import { generateWeatherAlerts as generateAIAlerts } from "../utils/aiService";
import { useWeatherSettings } from "../utils/hooks/useWeatherSettings";

function WeatherAlerts({ weatherData }) {
  const { settings } = useWeatherSettings();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      // Check if AI is enabled and API key is provided
      if (settings.aiEnabled && settings.aiApiKey && weatherData) {
        setLoading(true);
        setError(null);
        try {
          const aiAlerts = await generateAIAlerts(
            weatherData,
            settings.aiApiKey,
            settings.aiProvider || 'openai'
          );
          setAlerts(aiAlerts || []);
        } catch (err) {
          console.error('AI alert generation failed, falling back to rule-based:', err);
          setError(err.message);
          // Fallback to rule-based alerts
          const ruleBasedAlerts = getWeatherAlerts(weatherData);
          setAlerts(ruleBasedAlerts || []);
        } finally {
          setLoading(false);
        }
      } else {
        // Use rule-based alerts
        const ruleBasedAlerts = getWeatherAlerts(weatherData);
        setAlerts(ruleBasedAlerts || []);
      }
    };

    fetchAlerts();
  }, [weatherData, settings.aiEnabled, settings.aiApiKey, settings.aiProvider]);

  // Don't render if there are no alerts
  if (!alerts || alerts.length === 0) {
    if (loading) {
      return (
        <Card>
          <h3 className="font-bold text-lg mb-3" style={{ color: 'var(--fg)' }}>
            ⚠️ Weather Alerts
          </h3>
          <p className="text-sm" style={{ color: 'var(--gray)' }}>Loading AI alerts...</p>
        </Card>
      );
    }
    return null;
  }

  const getAlertStyle = (type) => {
    if (type === "danger") {
      return {
        backgroundColor: 'var(--red)',
        color: 'var(--bg-0)',
        borderColor: 'var(--red)'
      };
    } else {
      return {
        backgroundColor: 'var(--yellow)',
        color: 'var(--bg-0)',
        borderColor: 'var(--yellow)'
      };
    }
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-lg" style={{ color: 'var(--fg)' }}>
        ⚠️ Weather Alerts
      </h3>
        {settings.aiEnabled && settings.aiApiKey && (
          <span className="text-sm px-2 py-1 rounded font-semibold" style={{ backgroundColor: 'var(--bg-2)', color: 'var(--green)' }}>
            AI
          </span>
        )}
      </div>
      {loading && (
        <p className="text-sm mb-3" style={{ color: 'var(--gray)' }}>Generating AI alerts...</p>
      )}
      {error && (
        <p className="text-xs mb-3" style={{ color: 'var(--red)' }}>
          AI error: {error}. Using rule-based alerts.
        </p>
      )}
      <div className="space-y-3">
        <AnimatePresence>
        {alerts.map((alert, index) => (
            <motion.div
            key={index}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.9 }}
              transition={{ 
                type: "spring", 
                damping: 20, 
                stiffness: 300,
                delay: index * 0.1 
              }}
            className="p-3 rounded-lg border-2"
            style={getAlertStyle(alert.type)}
          >
            <div className="flex items-start gap-2">
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                  className="text-xl"
                >
                  {alert.icon}
                </motion.span>
              <div className="flex-1">
                <h4 className="font-bold text-sm mb-1">{alert.title}</h4>
                <p className="text-xs opacity-90">{alert.message}</p>
              </div>
            </div>
            </motion.div>
        ))}
        </AnimatePresence>
      </div>
    </Card>
  );
}

export default WeatherAlerts;

