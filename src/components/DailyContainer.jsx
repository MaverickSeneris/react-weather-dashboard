import React from "react";
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
          <div key={index} className="flex items-center justify-around text-sm">
            <span className="w-12 font-semibold text-lg text-slate-400 dark:text-gray-400">
              {day.day}
            </span>
            <div className="flex items-center">
              <img
                src={iconMap[day.icon]}
                alt={day.description}
                className="w-10"
              />
              <span className="pl-2 capitalize font-bold text-[0.8rem] dark:text-gray-300 w-32">
                {day.description}
              </span>
            </div>
            <div>
              <span className="font-bold text-lg">
                {convertTemp(day.tempHigh)}&deg;
              </span>
              <span className="text-gray-400 text-lg">
                /{convertTemp(day.tempLow)}&deg;
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default DailyContainer;
