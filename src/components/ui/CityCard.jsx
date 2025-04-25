// CityCard.jsx being rendered in City Favorite List
import React from "react";
import Card from "./Card";

const icons = {
  sunny: "☀️",
  rainy: "🌧",
  cloudy: "⛅",
};

const CityCard = ({ weatherData }) => {
    console.log(weatherData)

  return (
    <>
      {weatherData.map((city, index) => (
        <div key={index} className="mb-4">
          <Card>
            <button
              key={index}
              // className="flex justify-between items-center bg-gray-800 p-4 rounded"
              className="flex items-center justify-between w-[100%]"
            >
              <div>
                <div className="text-lg">{city.name}</div>
                <div className="text-sm">{city.condition}</div>
              </div>
              <div className="text-xl">{Math.round(city.temp)}&deg;</div>
            </button>
          </Card>
        </div>
      ))}
    </>
  );
};

export default CityCard;
