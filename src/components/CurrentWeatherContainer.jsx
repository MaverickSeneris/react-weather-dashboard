import React from "react";
import Card from "./ui/Card";
import CardTitle from "./ui/CardTitle";
import chanceOfRainIcon from "../assets/weather-icons/chance-of-rain.svg";
import temperatureIcon from "../assets/weather-icons/temperature.svg";
import windIcon from "../assets/weather-icons/wind.svg";
import uviIcon from "../assets/weather-icons/uv-index.svg";
import { Link } from "react-router";

function CurrentWeatherContainer({ currentWeatherInfo, cityName }) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <CardTitle title={"CURRENT CONDITION"} />
        <Link
          to={`/city/${cityName || "unknown"}`}
          state={{ currentWeatherInfo, cityName }}
          className=" flex justify-center items-center mb-2 bg-blue-500 px-2 py-1 rounded-full hover:bg-blue-600 transition"
        >
          <p className="font-bold text-xs !text-white">See more</p>
        </Link>
      </div>

      <div className="grid grid-cols-2 mt-4">
        <div className="pb-4">
          <div className="flex items-center gap-1">
            <img src={temperatureIcon} className="w-6 invert-70" />
            <p className="font-semibold text-gray-400">Real Feel</p>
          </div>
          <span className="pl-7 font-bold text-gray-300">
            {Math.floor(currentWeatherInfo.feelsLike)}&deg;
          </span>
        </div>
        <div className="pb-4 ml-4">
          <div className="flex items-center gap-1">
            <img src={windIcon} className="w-6 invert-70" />
            <p className="font-semibold text-gray-400">Wind</p>
          </div>
          <span className="pl-7 font-bold text-gray-300">
            {currentWeatherInfo.windSpeed} km/h
          </span>
        </div>
        <div>
          <div className="flex items-center gap-1">
            <img src={chanceOfRainIcon} className="w-6 invert-70" />
            <p className="font-semibold text-gray-400">Chance of Rain</p>
          </div>
          <span className="pl-7 font-bold text-gray-300">
            {currentWeatherInfo.chanceOfRain}%
          </span>
        </div>
        <div className="ml-4">
          <div className="flex items-center gap-1">
            <img src={uviIcon} className="w-6 invert-70" />
            <p className="font-semibold text-gray-400">UV index</p>
          </div>
          <span className="pl-7 font-bold text-gray-300">
            {currentWeatherInfo.uvIndex}
          </span>
        </div>
      </div>
    </Card>
  );
}

export default CurrentWeatherContainer;
