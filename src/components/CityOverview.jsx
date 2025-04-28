import React from "react";
import CardTitle from "./ui/CardTitle";
import CurrentCityContainer from "./CurrentCityContainer";
import DailyContainer from "./DailyContainer";
import HourlyContainer from "./HourlyContainer";
import { useLocation, useNavigate } from "react-router";
import CurrentWeatherContainer from "./CurrentWeatherContainer";
import iconMap from "../utils/weatherIconMapper";

function CityOverview({ children }) {
  const { state } = useLocation();
  const { currentWeatherInfo, cityName } = state || {};
  console.log(currentWeatherInfo.weatherIcon);
  return (
    <div className="flex flex-col items-center w-100 px-4 mt-10 pb-2">
      <CurrentCityContainer
        cityName={cityName}
        popValue={currentWeatherInfo.chanceOfRain}
        weatherIcon={iconMap[currentWeatherInfo.weatherIcon]}
        tempValue={currentWeatherInfo.temperature}
      />

      <CardTitle title={"TODAY'S FORECAST"} />
      <HourlyContainer
        hourlyWeatherInfo={{
          time: currentWeatherInfo.hourlyWeatherInfo.hourlyTime,
          icon: currentWeatherInfo.hourlyWeatherInfo.hourlyWeatherIcon,
          temperature: currentWeatherInfo.hourlyWeatherInfo.hourlyTemperature,
        }}
      />

      <CardTitle title={"7-DAY FORECAST"} />
      <DailyContainer dailyWeatherInfo={currentWeatherInfo.dailyWeatherInfo} />

      <CurrentWeatherContainer
        currentWeatherInfo={currentWeatherInfo}
        cityName={cityName}
      />
    </div>
  );
}

export default CityOverview;
