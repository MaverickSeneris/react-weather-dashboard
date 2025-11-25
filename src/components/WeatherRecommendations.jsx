import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Card from "./ui/Card";
import CardTitle from "./ui/CardTitle";
import { getWeatherRecommendations } from "../utils/weatherRecommendations";
import { generateWeatherRecommendations as generateAIRecommendations } from "../utils/aiService";
import { useWeatherSettings } from "../utils/hooks/useWeatherSettings";

function WeatherRecommendations({ weatherData }) {
  const { settings } = useWeatherSettings();
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      // Check if AI is enabled and API key is provided
      if (settings.aiEnabled && settings.aiApiKey && weatherData) {
        setLoading(true);
        setError(null);
        try {
          const aiRecommendations = await generateAIRecommendations(
            weatherData,
            settings.aiApiKey,
            settings.aiProvider || 'openai'
          );
          setRecommendations(aiRecommendations);
        } catch (err) {
          console.error('AI recommendation generation failed, falling back to rule-based:', err);
          setError(err.message);
          // Fallback to rule-based recommendations
          const ruleBasedRecommendations = getWeatherRecommendations(weatherData);
          setRecommendations(ruleBasedRecommendations);
        } finally {
          setLoading(false);
        }
      } else {
        // Use rule-based recommendations
        const ruleBasedRecommendations = getWeatherRecommendations(weatherData);
        setRecommendations(ruleBasedRecommendations);
      }
    };

    fetchRecommendations();
  }, [weatherData, settings.aiEnabled, settings.aiApiKey, settings.aiProvider]);

  if (!recommendations) {
    if (loading) {
      return (
        <Card>
          <CardTitle title={"RECOMMENDATIONS"} />
          <p className="text-sm" style={{ color: 'var(--gray)' }}>Generating AI recommendations...</p>
        </Card>
      );
    }
    return null;
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-2">
      <CardTitle title={"RECOMMENDATIONS"} />
        {settings.aiEnabled && settings.aiApiKey && (
          <span className="text-sm px-2 py-1 rounded font-semibold" style={{ backgroundColor: 'var(--bg-2)', color: 'var(--green)' }}>
            AI
          </span>
        )}
      </div>
      {loading && (
        <p className="text-sm mb-3" style={{ color: 'var(--gray)' }}>Generating AI recommendations...</p>
      )}
      {error && (
        <p className="text-xs mb-3" style={{ color: 'var(--red)' }}>
          AI error: {error}. Using rule-based recommendations.
        </p>
      )}
      
      {/* Clothing Recommendations */}
      {recommendations.clothing.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold text-sm mb-2" style={{ color: 'var(--fg)' }}>
            👕 What to Wear
          </h4>
          <div className="flex flex-wrap gap-2">
            {recommendations.clothing.map((item, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  type: "spring", 
                  damping: 15, 
                  stiffness: 200,
                  delay: index * 0.05 
                }}
                whileHover={{ scale: 1.05 }}
                className="px-3 py-1 rounded-full text-xs"
                style={{
                  backgroundColor: 'var(--bg-2)',
                  color: 'var(--fg)'
                }}
              >
                {item}
              </motion.span>
            ))}
          </div>
        </div>
      )}

      {/* Accessories */}
      {recommendations.accessories.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold text-sm mb-2" style={{ color: 'var(--fg)' }}>
            🎒 Accessories
          </h4>
          <div className="flex flex-wrap gap-2">
            {recommendations.accessories.map((item, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  type: "spring", 
                  damping: 15, 
                  stiffness: 200,
                  delay: index * 0.05 
                }}
                whileHover={{ scale: 1.05 }}
                className="px-3 py-1 rounded-full text-xs"
                style={{
                  backgroundColor: 'var(--bg-2)',
                  color: 'var(--fg)'
                }}
              >
                {item}
              </motion.span>
            ))}
          </div>
        </div>
      )}

      {/* Activities */}
      {recommendations.activities.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold text-sm mb-2" style={{ color: 'var(--fg)' }}>
            🎯 Suggested Activities
          </h4>
          <div className="flex flex-wrap gap-2">
            {recommendations.activities.map((activity, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  type: "spring", 
                  damping: 15, 
                  stiffness: 200,
                  delay: index * 0.05 
                }}
                whileHover={{ scale: 1.05 }}
                className="px-3 py-1 rounded-full text-xs"
                style={{
                  backgroundColor: 'var(--blue)',
                  color: 'var(--bg-0)'
                }}
              >
                {activity}
              </motion.span>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      {recommendations.tips.length > 0 && (
        <div>
          <h4 className="font-semibold text-sm mb-2" style={{ color: 'var(--fg)' }}>
            💡 Tips
          </h4>
          <ul className="list-disc list-inside space-y-1">
            {recommendations.tips.map((tip, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  type: "spring", 
                  damping: 20, 
                  stiffness: 200,
                  delay: index * 0.05 
                }}
                className="text-xs" 
                style={{ color: 'var(--gray)' }}
              >
                {tip}
              </motion.li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}

export default WeatherRecommendations;

