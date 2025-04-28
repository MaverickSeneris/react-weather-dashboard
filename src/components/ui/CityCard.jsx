// CityCard.jsx being rendered in City Favorite List
import React from "react";
import Card from "./Card";
import iconMap from "../../utils/weatherIconMapper";
import timeFormatter from "../../utils/timeFormatter";
import { Link } from "react-router";

const CityCard = ({ weatherData }) => {
  console.log(weatherData);

  return (
    <>
      {weatherData.map((city, index) => (
        <div key={city.cityId} className="mb-4">
          <Card>
            <Link
              // Uncomment to render CiteWeatherDetail page:
              // to={`/city/${city.cityId || "unknown"}`}

              // Uncomment to render CityOverview (! under construction) page:
              to={`/test/${city.cityId || "unknown"}`} //TODO MON, 04/28/25: RENDER ALL WEATHER INFORMATION

              key={city.cityId}
              state={{ currentWeatherInfo: city, cityName: city.name }}
              className="flex items-center justify-between w-[100%] h-8 visited:text-white"
            >
              <div className="flex items-center gap-5">
                <img
                  src={iconMap[city.weatherIcon]}
                  alt="weatherIcon"
                  className="w-15 mt-3"
                />
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[1rem] text-gray-300">
                      {city.name}
                    </span>
                    <span className="text-xs font-regular">{city.country}</span>
                  </div>
                  <div>
                    <p className="text-xs">{city.state}</p>
                  </div>
                  <div className="text-sm font-semibold text-gray-400">
                    {timeFormatter(city.time)}
                  </div>
                  {/* <div className="text-sm">{city.condition}</div> */}
                </div>
              </div>

              <div className="text-3xl self-start font-medium">
                {Math.round(city.temperature)}&deg;
              </div>
            </Link>
          </Card>
        </div>
      ))}
    </>
  );
};

export default CityCard;
