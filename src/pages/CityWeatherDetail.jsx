import React from "react";
import { useLocation, useNavigate } from "react-router";
import CurrentCityContainer from "../components/CurrentCityContainer";
import iconMap from "../utils/weatherIconMapper";
import { BiChevronLeft } from "react-icons/bi";
import Card from "../components/ui/Card";

function CityWeatherDetail() {
  const { state } = useLocation();
  const { currentWeatherInfo, cityName } = state || {};
  const navigate = useNavigate();

  const cityInfo = [
    {
      temperature: currentWeatherInfo.temperature,
      uvIndex: currentWeatherInfo.uvIndex,
      wind: currentWeatherInfo.windSpeed,
      feelsLike: currentWeatherInfo.feelsLike,
      pressure: currentWeatherInfo.pressure,
      humidity: currentWeatherInfo.humidity,
      visibility: currentWeatherInfo.visibility,
      pressure: currentWeatherInfo.pressure,
      sunrise: currentWeatherInfo.sunrise,
      sunset: currentWeatherInfo.sunset,
    },
  ];

  console.log(currentWeatherInfo, "-----", cityInfo);
  return (
    <div className="flex flex-col items-center w-screen px-4 mt-5 pb-2">
      <button
        onClick={() => navigate(-1)}
        className="self-start font-medium text-white hover:text-blue-400 mb-4"
      >
        <BiChevronLeft className="w-8 h-8 mr-1" />
      </button>
      <CurrentCityContainer
        cityName={cityName}
        popValue={Math.round(currentWeatherInfo.chanceOfRain * 100)}
        weatherIcon={iconMap[currentWeatherInfo.weatherIcon]}
        tempValue={Math.floor(currentWeatherInfo.temperature)}
      />

      {cityInfo.map((info, index) => {
        return (
          <div className="grid grid-cols-2 mt-2">
            <Card>{info.uvIndex}</Card>
            <Card>{info.wind}</Card>
            <Card>{info.uvIndex}</Card>
            <Card>{info.wind}</Card>
            <Card>{info.uvIndex}</Card>
            <Card>{info.wind}</Card>
            <Card>{info.uvIndex}</Card>
            <Card>{info.wind}</Card>
          </div>
        );
      })}
    </div>
  );
}

export default CityWeatherDetail;
