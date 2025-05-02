import React from "react";
import iconMap from "../utils/weatherIconMapper";
import Card from "./ui/Card";
import CardTitle from "./ui/CardTitle";
import { useWeatherSettings } from "../utils/hooks/useWeatherSettings";

function HourlyContainer({ hourlyWeatherInfo }) {
  const { settings } = useWeatherSettings();

  const convertTemp = (temp) => {
    return settings.temperature === "Fahrenheit"
      ? Math.round((temp * 9) / 5 + 32)
      : Math.round(temp);
  };

  return (
    <Card>
      <CardTitle title={"TODAY'S FORECAST"} />
      <div className={`flex flex-col my-2 items-center w-[100%]`}>
        <div className="w-[100%] flex justify-between">
          {hourlyWeatherInfo.time.map((time, index) => (
            <span
              key={index}
              className="w-max font-bold pb-2 text-gray-400 text-center"
            >
              {time}
            </span>
          ))}
        </div>
        <div className="w-[100%] flex justify-between">
          {hourlyWeatherInfo.icon.map((icon, index) => (
            <img
              className="w-16"
              key={index}
              src={iconMap[icon]}
              alt="weather icon"
            />
          ))}
        </div>
        <div className="w-[88%] flex justify-between">
          {hourlyWeatherInfo.temperature.map((temp, index) => (
            <span key={index} className="font-extrabold text-xl">
              {convertTemp(temp)}&deg;
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}

export default HourlyContainer;
