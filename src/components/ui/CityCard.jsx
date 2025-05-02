import React, { useState } from "react";
import Card from "./Card";
import iconMap from "../../utils/weatherIconMapper";
import timeFormatter from "../../utils/timeFormatter";
import { Link } from "react-router"; // or "react-router-dom" if needed
import { IoAddSharp } from "react-icons/io5";
import { useWeatherSettings } from "../../utils/hooks/useWeatherSettings"; // ✅ import

const CityCard = ({ weatherData }) => {
  const [draggedId, setDraggedId] = useState(null);
  const [swiped, setSwiped] = useState(false);
  const [saveMessages, setSaveMessages] = useState({});

  const { settings } = useWeatherSettings(); // ✅ use settings

  const convertTemp = (temp) =>
    settings.temperature === "Fahrenheit"
      ? Math.round((temp * 9) / 5 + 32)
      : Math.round(temp);

  const convertWind = (speedKph) =>
    settings.windSpeed === "mph"
      ? Math.round(speedKph / 1.609)
      : Math.round(speedKph);

  function handleSaveCity(cityId) {
    const city = weatherData.find((c) => c.cityId === cityId);
    if (!city) return;

    const savedCity = {
      cityId: city.cityId,
      name: city.name,
      lat: city.lat,
      lon: city.lon,
    };

    const saved = JSON.parse(localStorage.getItem("savedCities")) || [];
    const isDuplicate = saved.some(
      (c) => c.lat === savedCity.lat && c.lon === savedCity.lon
    );

    const newMessage = isDuplicate
      ? "\u26a0\ufe0f Already saved."
      : "\u2705 City saved!";

    setSaveMessages((prev) => ({ ...prev, [cityId]: newMessage }));
    setTimeout(() => {
      setSaveMessages((prev) => ({ ...prev, [cityId]: "" }));
    }, 3000);

    if (isDuplicate) return;

    const updated = [...saved, savedCity];
    localStorage.setItem("savedCities", JSON.stringify(updated));
    console.log("\u2705 City saved!", savedCity);

    setDraggedId(null);
    setSwiped(false);
  }

  return (
    <>
      {weatherData.map((city) => (
        <div
          key={city.cityId}
          className="relative flex items-center"
          onTouchStart={() => setDraggedId(city.cityId)}
          onTouchMove={(e) => {
            if (e.touches[0].clientX < 150) setSwiped(true);
          }}
        >
          <div
            className={`transition-all duration-500 ${
              draggedId === city.cityId && swiped
                ? "flex-grow-[0.95]"
                : "flex-grow"
            }`}
          >
            <Card>
              {saveMessages[city.cityId] ? (
                <div className="flex items-center justify-center w-full text-white font-bold h-[55px]">
                  {saveMessages[city.cityId]}
                </div>
              ) : (
                <Link
                  to={`/test/${city.cityId || "unknown"}`}
                  state={{ currentWeatherInfo: city, cityName: city.name }}
                  className="flex items-center justify-between w-full visited:text-white h-[55px]"
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
                        <span className="text-xs font-regular">
                          {city.country}
                        </span>
                      </div>
                      <p className="text-xs">{city.state}</p>
                      <div className="text-sm font-semibold text-gray-400">
                        {timeFormatter(city.time)}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end self-start">
                    <div className="text-3xl font-medium">
                      {convertTemp(city.temperature)}&deg;
                    </div>
                    <div className="text-xs text-gray-400">
                      💨 {convertWind(city.windSpeed)}{" "}
                      {settings.windSpeed === "mph" ? "mph" : "km/h"}
                    </div>
                  </div>
                </Link>
              )}
            </Card>
          </div>

          {draggedId === city.cityId && swiped && (
            <button
              onClick={() => handleSaveCity(city.cityId)}
              className="ml-4 flex-shrink-0 p-5 bg-green-500 hover:bg-green-400 active:bg-green-400 focus:bg-green-400 text-white rounded-[15px] h-[100px] w-[20%]"
            >
              <IoAddSharp size={"35px"} />
            </button>
          )}
        </div>
      ))}
    </>
  );
};

export default CityCard;
