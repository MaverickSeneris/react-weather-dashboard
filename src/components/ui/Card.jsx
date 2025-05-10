import React from "react";
import { useWeatherSettings } from "../../utils/hooks/useWeatherSettings";

function Card({ children }) {
  const { settings } = useWeatherSettings();


  return (
    <div
      className={`border-0 p-6 h-max rounded-[20px] my-2 w-full ${
        settings.dark ? "bg-gray-800 text-white" : "bg-gray-100 text-black"
      }`}
    >
      {children}
    </div>
  );
}

export default Card;
