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

  const now = new Date();
  const sunrise = currentWeatherInfo.sunrise;
  const sunset = currentWeatherInfo.sunset;
  const isDayTime = now >= sunrise && now < sunset;

  const displayLabel = isDayTime ? "SUNRISE" : "SUNSET";
  const displayTime = isDayTime ? sunrise : sunset;

  const cityInfo = [
    {
      temperature: currentWeatherInfo.temperature,
      uvIndex: currentWeatherInfo.uvIndex,
      wind: currentWeatherInfo.windSpeed,
      feelsLike: currentWeatherInfo.feelsLike,
      pressure: currentWeatherInfo.pressure,
      humidity: currentWeatherInfo.humidity,
      visibility: currentWeatherInfo.visibility,
      sunrise: sunrise,
      sunset: sunset,
      chanceOfRain: currentWeatherInfo.chanceOfRain,
    },
  ];

  const ValueContainer = ({ value, unit }) => (
    <span className="font-bold text-[1.4rem] text-gray-300">
      {value}
      {unit}
    </span>
  );

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

      {cityInfo.map((info, index) => (
        <div key={index} className="grid grid-cols-2 mt-2 w-[100%] gap-x-4">
          <Card>
            <CardTitle title={"UV INDEX"} />
            <ValueContainer value={Math.ceil(info.uvIndex)} />
          </Card>
          <Card>
            <CardTitle title={"WIND"} />
            <ValueContainer value={info.wind} unit={" km/h"} />
          </Card>
          <Card>
            <CardTitle title={"HUMIDITY"} />
            <ValueContainer value={info.humidity} unit={"%"} />
          </Card>
          <Card>
            <CardTitle title={"VISIBILITY"} />
            <ValueContainer value={info.visibility / 1000} unit={" km"} />
          </Card>
          <Card>
            <CardTitle title={"FEELS LIKE"} />
            <ValueContainer value={Math.floor(info.feelsLike)} unit={"°"} />
          </Card>
          <Card>
            <CardTitle title={"CHANCE OF RAIN"} />
            <ValueContainer value={info.chanceOfRain} unit={"%"} />
          </Card>
          <Card>
            <CardTitle title={"PRESSURE"} />
            <ValueContainer value={info.pressure} unit={" hPa"} />
          </Card>
          <Card>
            <CardTitle title={displayLabel} />
            <ValueContainer value={formatTime(displayTime)} />
          </Card>
        </div>
      ))}
    </div>
  );
}

export default CityWeatherDetail;
