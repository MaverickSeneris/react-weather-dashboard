// CityCard.jsx being rendered in City Favorite List
import React from "react";
import Card from "./Card";

const icons = {
  sunny: "☀️",
  rainy: "🌧",
  cloudy: "⛅",
};

const CityCard = ({ data }) => {
  return (
    <div className="mb-4">
      <Card className="city-card">
        <div className="flex items-center justify-between">
          <div className="text-5xl">{icons[data.condition]}</div>
          <div>{data.name}</div>
          <div>{data.temp}�</div>
          <div>
            {new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CityCard;
