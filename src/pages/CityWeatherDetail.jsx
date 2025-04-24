import React from "react";
import { useLocation, useNavigate } from "react-router";
import CurrentCityContainer from "../components/CurrentCityContainer";
import iconMap from "../utils/weatherIconMapper";
import { BiChevronLeft } from "react-icons/bi";
import Card from "../components/ui/Card";
import formatTime from "../utils/timeFormatter"; //Helper function to convert raw UNIX sunrise and sunset time
import CardTitle from "../components/ui/CardTitle";

function CityWeatherDetail() {
  // Accessing route state (data passed from previous route)
  const { state } = useLocation();
  const { currentWeatherInfo, cityName } = state || {};
  const navigate = useNavigate(); // for going back to previous page

  // Get current time
  const now = new Date();

  // Get raw UNIX sunrise and sunset time
  const sunrise = currentWeatherInfo.sunrise;
  const sunset = currentWeatherInfo.sunset;

  // Determine if it's currently daytime (this logic assumes sunrise/sunset are already Date objects)
  const isDayTime = now >= sunrise && now < sunset;

  // Choose which label/time to display: if it's day, show sunset time; if it's night, show sunrise time
  const displayLabel = isDayTime ? "SUNRISE" : "SUNSET";
  const displayTime = isDayTime ? sunrise : sunset;

  // This array helps organize and iterate over the weather data
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

  // Component to format and display the value with optional units
  const ValueContainer = ({ value, unit }) => (
    <span className="font-bold text-[1.4rem] text-gray-300">
      {value}
      {unit}
    </span>
  );

  return (
    <div className="flex flex-col items-center w-screen px-4 mt-5 pb-2">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="self-start font-medium text-white hover:text-blue-400 mb-4"
      >
        <BiChevronLeft className="w-8 h-8 mr-1" />
      </button>

      {/* Top current weather display */}
      <CurrentCityContainer
        cityName={cityName}
        popValue={Math.round(currentWeatherInfo.chanceOfRain * 100)} // convert decimal to percentage
        weatherIcon={iconMap[currentWeatherInfo.weatherIcon]} // map API icon to local icon
        tempValue={Math.floor(currentWeatherInfo.temperature)} // round temp
      />

      {/* Detailed weather info cards */}
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
            {/* convert meters to km */}
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
            {/* convert UNIX or Date to formatted time */}
          </Card>
        </div>
      ))}
    </div>
  );
}

export default CityWeatherDetail;
