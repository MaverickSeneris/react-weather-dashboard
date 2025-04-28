import React from "react";
import CardTitle from "./ui/CardTitle";
import CurrentCityContainer from "./CurrentCityContainer";
import DailyContainer from "./DailyContainer";
import HourlyContainer from "./HourlyContainer";
import { useLocation, useNavigate } from "react-router";
import CurrentWeatherContainer from "./CurrentWeatherContainer";
import iconMap from "../utils/weatherIconMapper";
import { BiChevronLeft } from "react-icons/bi";

function CityOverview({ children }) {
  const { state } = useLocation();
  const { currentWeatherInfo, cityName } = state || {};
  const navigate = useNavigate(); // for going back to previous page
  console.log(currentWeatherInfo.weatherIcon);
  return (
    <div className="flex flex-col items-center w-100 px-4 mt-4 pb-2">
      <button
        onClick={() => navigate(-1)}
        className="self-start font-medium text-white hover:text-blue-400 mb-4"
      >
        <BiChevronLeft className="w-8 h-8 mr-1" />
      </button>
      <CurrentCityContainer
        cityName={cityName}
        popValue={currentWeatherInfo.chanceOfRain}
        weatherIcon={iconMap[currentWeatherInfo.weatherIcon]}
        tempValue={currentWeatherInfo.temperature}
      />

      <HourlyContainer
        hourlyWeatherInfo={{
          time: currentWeatherInfo.hourlyWeatherInfo.hourlyTime,
          icon: currentWeatherInfo.hourlyWeatherInfo.hourlyWeatherIcon,
          temperature: currentWeatherInfo.hourlyWeatherInfo.hourlyTemperature,
        }}
      />

      <DailyContainer dailyWeatherInfo={currentWeatherInfo.dailyWeatherInfo} />

      <CurrentWeatherContainer
        currentWeatherInfo={currentWeatherInfo}
        cityName={cityName}
      />
    </div>
  );
}

export default CityOverview;
