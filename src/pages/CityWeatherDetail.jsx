import React from "react";
import { useLocation, useNavigate } from "react-router";
import CurrentCityContainer from "../components/CurrentCityContainer";
import iconMap from "../utils/weatherIconMapper";
import { BiChevronLeft } from "react-icons/bi";
import Card from "../components/ui/Card";
import formatTime from "../utils/timeFormatter";
import CardTitle from "../components/ui/CardTitle";

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
      chanceOfRain: currentWeatherInfo.chanceOfRain,
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
          <div key={index} className="grid grid-cols-2 mt-2 w-[100%] gap-x-4">
            <Card>
              <CardTitle title={"UV INDEX"} />
              {info.uvIndex}
            </Card>
            <Card>
              <CardTitle title={"WIND"} />
              {info.wind}km/h
            </Card>
            <Card>
              <CardTitle title={"HUMIDITY"} />
              {info.humidity}%
            </Card>
            <Card>
              <CardTitle title={"VISIBILITY"} />
              {info.visibility / 1000}km
            </Card>
            <Card>
              <CardTitle title={"FEELS LIKE"} />
              {Math.floor(info.feelsLike)}&deg;
            </Card>
            <Card>
              <CardTitle title={"CHANCE OF RAIN"} />
              {info.chanceOfRain}%
            </Card>
            <Card>
              <CardTitle title={"PRESSURE"} />
              {info.pressure}hPa
            </Card>
            <Card>
              <CardTitle title={"SUNSET"} />
              {formatTime(info.sunset)}
            </Card>
          </div>
        );
      })}
    </div>
  );
}

export default CityWeatherDetail;
