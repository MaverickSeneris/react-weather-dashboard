import React from "react";
import { motion } from "framer-motion";
import Card from "./ui/Card";
import CardTitle from "./ui/CardTitle";
import chanceOfRainIcon from "../assets/weather-icons/chance-of-rain.svg";
import temperatureIcon from "../assets/weather-icons/temperature.svg";
import windIcon from "../assets/weather-icons/wind.svg";
import uviIcon from "../assets/weather-icons/uv-index.svg";
import { Link } from "react-router";
import { useWeatherSettings } from "../utils/hooks/useWeatherSettings";

function CurrentWeatherContainer({ currentWeatherInfo, cityName }) {
  const { settings } = useWeatherSettings();

  const convertTemp = (temp) => {
    return settings.temperature === "Fahrenheit"
      ? Math.round((temp * 9) / 5 + 32)
      : Math.round(temp);
  };

  const convertWind = (speedMps) => {
    // API provides wind speed in m/s
    if (settings.windSpeed === "km/h") return Math.round(speedMps * 3.6);
    if (settings.windSpeed === "mph") return Math.round(speedMps * 2.237);
    if (settings.windSpeed === "Knots") return Math.round(speedMps * 1.944);
    return Math.round(speedMps); // m/s fallback
  };

  return (
    <Card>
      <div className="flex items-center justify-between">
        <CardTitle title={"CURRENT CONDITION"} />
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            to={`/city/${currentWeatherInfo.cityId || "unknown"}`}
            state={{ currentWeatherInfo, cityName }}
            className="flex justify-center items-center mb-2 px-2 py-1 rounded-full transition"
            style={{ backgroundColor: 'var(--blue)', color: 'var(--bg-0)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--aqua)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--blue)'}
          >
            <p className="font-bold text-xs">See more</p>
          </Link>
        </motion.div>
      </div>

      <div className="grid grid-cols-2 mt-4">
        {[
          { icon: temperatureIcon, label: "Real Feel", value: `${convertTemp(currentWeatherInfo.feelsLike)}°`, delay: 0 },
          { icon: windIcon, label: "Wind", value: `${convertWind(currentWeatherInfo.windSpeed)} ${settings.windSpeed}`, delay: 0.1, ml: true },
          { icon: chanceOfRainIcon, label: "Chance of Rain", value: `${currentWeatherInfo.chanceOfRain}%`, delay: 0.2 },
          { icon: uviIcon, label: "UV index", value: currentWeatherInfo.uvIndex, delay: 0.3, ml: true }
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              type: "spring", 
              damping: 20, 
              stiffness: 300,
              delay: item.delay 
            }}
            whileHover={{ scale: 1.05, y: -2 }}
            className={`pb-4 ${item.ml ? 'ml-4' : ''}`}
          >
            <motion.div
              className="flex items-center gap-1"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: item.delay + 0.1 }}
            >
              <motion.img
                src={item.icon}
                className="w-6 invert-70"
                whileHover={{ 
                  rotate: [0, -10, 10, 0],
                  scale: 1.2,
                  transition: { duration: 0.4 }
                }}
              />
              <p className="font-semibold" style={{ color: 'var(--gray)' }}>
                {item.label}
              </p>
            </motion.div>
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                type: "spring", 
                damping: 20, 
                stiffness: 300,
                delay: item.delay + 0.15
              }}
              className="pl-7 font-bold block" 
              style={{ color: 'var(--fg)' }}
            >
              {item.value}
            </motion.span>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}

export default CurrentWeatherContainer;
