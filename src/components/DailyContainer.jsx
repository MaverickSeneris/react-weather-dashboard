import React from "react";
import { motion } from "framer-motion";
import Card from "./ui/Card";
import CardTitle from "./ui/CardTitle";
import iconMap from "../utils/weatherIconMapper";
import { useWeatherSettings } from "../utils/hooks/useWeatherSettings";

function DailyContainer({ dailyWeatherInfo }) {
  const { settings } = useWeatherSettings();

  const convertTemp = (temp) => {
    return settings.temperature === "Fahrenheit"
      ? Math.round((temp * 9) / 5 + 32)
      : Math.round(temp);
  };

  return (
    <Card>
      <div className="space-y-3">
        <CardTitle title={"7-DAY FORECAST"} />
        {dailyWeatherInfo.map((day, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              type: "spring", 
              damping: 20, 
              stiffness: 300,
              delay: index * 0.08 
            }}
            whileHover={{ 
              x: 5,
              transition: { duration: 0.2 }
            }}
            className="flex items-center justify-around text-sm"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.08 + 0.1 }}
              className="w-12 font-semibold text-lg" 
              style={{ color: 'var(--gray)' }}
            >
              {day.day}
            </motion.span>
            <div className="flex items-center">
              <motion.img
                src={iconMap[day.icon]}
                alt={day.description}
                className="w-10"
                initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ 
                  type: "spring", 
                  damping: 15, 
                  stiffness: 200,
                  delay: index * 0.08 + 0.2
                }}
                whileHover={{ 
                  scale: 1.3,
                  rotate: [0, -15, 15, 0],
                  transition: { duration: 0.4 }
                }}
              />
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.08 + 0.15 }}
                className="pl-2 capitalize font-bold text-[0.8rem] w-32" 
                style={{ color: 'var(--fg)' }}
              >
                {day.description}
              </motion.span>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                type: "spring", 
                damping: 20, 
                stiffness: 300,
                delay: index * 0.08 + 0.25
              }}
              whileHover={{ scale: 1.1 }}
            >
              <span className="font-bold text-lg">
                {convertTemp(day.tempHigh)}&deg;
              </span>
              <span className="text-lg" style={{ color: 'var(--gray)' }}>
                /{convertTemp(day.tempLow)}&deg;
              </span>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}

export default DailyContainer;
