// CityCard.jsx being rendered in City Favorite List
import React from "react";
import Card from "./Card";
import iconMap from "../../utils/weatherIconMapper";
import timeFormatter from "../../utils/timeFormatter";
const CityCard = ({ weatherData }) => {
  console.log(weatherData);

  return (
    <>
      {weatherData.map((city, index) => (
        <div key={index} className="mb-4">
          <Card>
            <button
              key={index}
              className="flex items-center justify-between w-[100%] h-8"
            >
              <div className="flex items-center gap-5">
                <img
                  src={iconMap[city.weatherIcon]}
                  alt="weatherIcon"
                  className="w-15 mt-3"
                />
                <div className="flex flex-col items-start">
                  <div className="text-xl font-medium text-gray-300">{city.name}</div>
                  <div className="text-sm font-semibold text-gray-400">{timeFormatter(city.time)}</div>
                  {/* <div className="text-sm">{city.condition}</div> */}
                </div>
              </div>

              <div className="text-3xl self-start font-medium">{Math.round(city.temp)}&deg;</div>
            </button>
          </Card>
        </div>
      ))}
    </>
  );
};

export default CityCard;
