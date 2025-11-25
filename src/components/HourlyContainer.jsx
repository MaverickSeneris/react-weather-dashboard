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
              <span
                key={index}
                className="w-max font-bold pb-2 text-center"
                style={{ color: 'var(--gray)' }}
              >
                {t}
              </span>
            ))}
          </div>
          <div className="w-full flex justify-between">
            {icon.map((i, index) => (
              <img
                className="w-16"
                key={index}
                src={iconMap[i]}
                alt="weather icon"
              />
            ))}
          </div>
          <div className="w-[88%] flex justify-between">
            {temperature.map((temp, index) => (
              <span key={index} className="font-extrabold text-xl">
                {convertTemp(temp)}&deg;
              </span>
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
