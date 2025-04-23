import React from "react";
import Card from "./Card";
import CardTitle from "./CardTitle";
import iconMap from "../utils/weatherIconMapper";

function DailyContainer({ dailyWeatherInfo }) {
  return (
    <Card>
      <div className="space-y-3">
        <CardTitle title={"7-DAY FORECAST"} />
        {dailyWeatherInfo.map((day, index) => (
          <div key={index} className="flex items-center justify-around text-sm">
            <span className="w-12 font-semibold text-lg text-gray-400">
              {day.day}
            </span>
            <div className="flex items-center">
              <img
                src={iconMap[day.icon]}
                alt={day.description}
                className="w-10"
              />
              <span className="pl-2 capitalize font-bold text-[0.8rem] text-gray-300 w-32">
                {day.description}
              </span>
            </div>
            <div>
              <span className="font-bold text-lg">{day.tempHigh}</span>
              <span className="text-gray-400 text-lg">/{day.tempLow}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default DailyContainer;
