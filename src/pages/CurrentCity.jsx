import React, {useState, useEffect } from "react";
import sunny from "../assets/weather-icons/02_clear.svg";
import Card from "../components/Card";
import hourly from "../seed-data/hourlyseed";

import axios from "axios";

function CurrentCity() {
  const [cityWeatherData, setCityWeatherData] = useState({})
  useEffect(() => { 
    const oneCallApiUrl = import.meta.env.VITE_OPENWEATHER_ONECALL_API_URL
    const oneCallApiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
    
    console.log("url and keys:", oneCallApiKey, oneCallApiUrl)
    navigator.geolocation.getCurrentPosition(
       (position) => {
         const { latitude, longitude } = position.coords;
         console.log("Browser coordinates:", latitude, longitude);
         // Next step: fetch weather using these coords
         axios
           .get(
             `${oneCallApiUrl}lat=${latitude}&lon=${longitude}&appid=${oneCallApiKey}`
           )
           .then((response) => {
             console.log(response.data); // response object
           })
           .catch((error) => {
             console.error(error);
           });
       },
       (error) => {
         console.error("Location error:", error.message);
       }
     );
  },[])


  return (
    <div className="flex flex-col items-center w-100 h-100 px-8 mt-16">
      {/* Current Forecast */}
      <span className="font-extrabold text-4xl my-2">Madrid</span>
      <p className="text-s">Chances of rain: 0%</p>
      <img src={sunny} alt="clear" className="my-6 w-50 pl-4" />
      <p className="text-5xl font-bold mb-8">31&deg;</p>

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
