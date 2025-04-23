import React from "react";
import iconMap from "../utils/weatherIconMapper";
import Card from "./Card";
import CardTitle from "./CardTitle";

function HourlyContainer({ hourlyWeatherInfo }) {
  return (
    <Card>
      <CardTitle title={"TODAY'S FORECAST"} />
      <div className={`flex flex-col my-2 items-center w-[100%]`}>
        <div className="w-[100%] flex justify-between">
          {hourlyWeatherInfo.time.map((time, index) => {
            return (
              <span key={index} className="w-max font-bold pb-2 text-gray-400">
                {time}
              </span>
            );
          })}
        </div>
        <div className="w-[100%] flex justify-between">
          {hourlyWeatherInfo.icon.map((icon, index) => {
            return (
              <img
                className="w-16"
                key={index}
                src={iconMap[icon]}
                alt="weather icon"
              />
            );
          })}
        </div>
        <div className="w-[88%] flex justify-between">
          {hourlyWeatherInfo.temperature.map((temp, index) => {
            return (
              <span key={index} className="font-extrabold text-xl">
                {Math.floor(temp)}&deg;
              </span>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

export default HourlyContainer;
