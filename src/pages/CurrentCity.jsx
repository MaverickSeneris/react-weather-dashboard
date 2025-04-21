import React, { useState, useEffect } from "react";
import sunny from "../assets/weather-icons/02_clear.svg";
import cloudy from "../assets/weather-icons/04_cloudy.svg";
import Card from "../components/Card";
import hourly from "../seed-data/hourlyseed";


import axios from "axios";
import iconMap from "../utils/weatherIconMapper";

function CurrentCity() {
  const [cityInfo, setCityInfo] = useState({
    town: "",
    state: "",
    country: "",
    village: "",
    region: "",
  });
  // const [cityWeatherData, setCityWeatherData] = useState({});
  const [currentWeatherInfo, setCurrentWeatherInfo] = useState({});
  const [hourlyWeatherInfo, setHourlyWeatherInfo] = useState({});
  const [dailyWeatherInfo, setDailyWeatherInfo] = useState({});
  const [unit, setUnit] = useState("metric")

  const iconSrc = iconMap[currentWeatherInfo.weatherIcon];

  useEffect(() => {
    const weatherApiUrl = import.meta.env.VITE_OPENWEATHER_ONECALL_API_URL;
    const weatherApiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
    const geoLocationApiKey = import.meta.env.VITE_OPENCAGE_API_KEY;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
      
        // First Step: Fetch current location using these coordinates:
        axios
          .get(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${geoLocationApiKey}`
          )
          .then((response) => {
            const components = response.data.results[0].components;

            setCityInfo({
              town: components.town || "",
              state: components.state || "",
              country: components.country || "",
              village: components.village || "",
              region: components.region || "",
            });
          })
          .catch((err) => {
            console.error("Failed to fetch location:", err);
          });

        // Next step: fetch weather using these coordinates:
        axios
          .get(
            `${weatherApiUrl}lat=${latitude}&lon=${longitude}&appid=${weatherApiKey}&units=${unit}`
          )
          .then((response) => {
            // console.log(response.data); // response object
            const weatherData = response.data;

            setCurrentWeatherInfo({
              temperature: weatherData.current.temp || "",
              weatherIcon: weatherData.current.weather[0].icon
            });
            console.log(weatherData.current.weather[0].icon);

            setDailyWeatherInfo({
              chanceOfRain: weatherData.daily?.[0]?.pop ?? 0,
            });
          })
          .catch((error) => {
            console.error(error);
          });
      },
      (error) => {
        console.error("Location error:", error.message);
      }
    );
  }, []);

  return (
    <div className="flex flex-col items-center w-100 h-100 px-8 mt-16">
      {/* Current Forecast */}
      <span className="font-extrabold text-4xl my-2">{cityInfo.village}</span>
      <p className="text-s">
        Chance of rain: {Math.round(dailyWeatherInfo.chanceOfRain * 100)}%
      </p>
      <img src={iconSrc} className="my-6 w-50 pl-4" />
      <p className="text-5xl font-bold mb-8">
        {Math.floor(currentWeatherInfo.temperature)}&deg;
      </p>

      {/* Hourly Forecast */}
      <Card>
        <p className="text-sm font-semibold text-gray-300">Today's Forcast</p>
        <div className="flex gap-4 my-2 justify-around items-center w-[100%]">
          {hourly.map((data, index) => {
            return (
              <div
                key={index}
                className={`flex flex-col justify-between items-center px-3 py-2 ${
                  index === 1 ? "border-x border-gray-500" : ""
                }`}
              >
                <span className="font-semibold pb-2 text-gray-300">
                  {data.time}
                </span>
                {data.weather === "sunny" && (
                  <img src={sunny} className="w-18 pl-1.5" />
                )}
                <span className="font-bold text-gray-300">
                  {data.temperature}&deg;
                </span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

export default CurrentCity;
