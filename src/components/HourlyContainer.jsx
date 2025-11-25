import React from "react";
import { motion } from "framer-motion";
import iconMap from "../utils/weatherIconMapper";
import Card from "./ui/Card";
import CardTitle from "./ui/CardTitle";
import { useWeatherSettings } from "../utils/hooks/useWeatherSettings";
import { convertTemperature } from "../utils/unitConverter";

function HourlyContainer({ hourlyWeatherInfo }) {
  const { settings } = useWeatherSettings();

  const convertTemp = (temp) => {
    return Math.round(convertTemperature(temp, settings.temperature));
  };

  const { time = [], icon = [], temperature = [] } = hourlyWeatherInfo || {};

  const hasData = time.length && icon.length && temperature.length;

  console.log("hourlyWeatherInfo", hourlyWeatherInfo);


  return (
    <Card>
      <CardTitle title={"TODAY'S FORECAST"} />
      {hasData ? (
        <div className="flex flex-col my-2 items-center w-full">
          <div className="w-full flex justify-between">
            {time.map((t, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  type: "spring", 
                  damping: 20, 
                  stiffness: 300,
                  delay: index * 0.1 
                }}
                className="w-max font-bold pb-2 text-center"
                style={{ color: 'var(--gray)' }}
              >
                {t}
              </motion.span>
            ))}
          </div>
          <div className="w-full flex justify-between">
            {icon.map((i, index) => (
              <motion.img
                className="w-16"
                key={index}
                src={iconMap[i]}
                alt="weather icon"
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                  type: "spring", 
                  damping: 15, 
                  stiffness: 200,
                  delay: index * 0.15 + 0.3
                }}
                whileHover={{ 
                  scale: 1.2,
                  rotate: [0, -10, 10, 0],
                  transition: { duration: 0.4 }
                }}
              />
            ))}
          </div>
          <div className="w-[88%] flex justify-between">
            {temperature.map((temp, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  type: "spring", 
                  damping: 20, 
                  stiffness: 300,
                  delay: index * 0.1 + 0.5
                }}
                whileHover={{ scale: 1.1 }}
                className="font-extrabold text-xl"
              >
                {convertTemp(temp)}&deg;
              </motion.span>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center py-4" style={{ color: 'var(--gray)' }}>
          Loading forecast...
        </p>
      )}
    </Card>
  );
}

export default HourlyContainer;
