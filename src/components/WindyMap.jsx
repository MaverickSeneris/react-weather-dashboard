import { useState, useEffect } from "react";
import Header from "./ui/Header";
import { useWeatherSettings } from "../utils/hooks/useWeatherSettings";

const overlayOptions = ["wind", "temp", "rain", "clouds"];

const WindyMapEmbed = () => {
  const [coordinates, setCoordinates] = useState({ lat: 14.6, lon: 121.0 });
  const [error, setError] = useState(null);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [overlay, setOverlay] = useState(
    localStorage.getItem("overlayPreference") || "wind" // Load saved preference or default to "wind"
  );
  const [loading, setLoading] = useState(true);
  const [locationName, setLocationName] = useState("");
  const { settings } = useWeatherSettings();
  const [showSpotForecast, setShowSpotForecast] = useState(
    JSON.parse(localStorage.getItem("spotForecastPreference")) ?? true // Load saved preference or default to true
  );

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        setCoordinates({ lat: latitude, lon: longitude });
        const geoKey = import.meta.env.VITE_OPENCAGE_API_KEY;

        try {
          const res = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${geoKey}`
          );
          const data = await res.json();
          const components = data.results[0]?.components;
          const town =
            components.village ||
            components.city ||
            components.town ||
            components.municipality ||
            components.county ||
            "Unknown location";
          setLocationName(town);
        } catch (err) {
          console.error("OpenCage error:", err);
          setLocationName("Unknown location");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error("Geolocation error:", err.message);
        setError("Failed to get your location. Showing default location.");
        setLoading(false);
      }
    );

    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleOverlayChange = (option) => {
    setOverlay(option);
    localStorage.setItem("overlayPreference", option); // Save preference to localStorage
  };

  const toggleSpotForecast = () => {
    const newValue = !showSpotForecast;
    setShowSpotForecast(newValue);
    localStorage.setItem("spotForecastPreference", JSON.stringify(newValue)); // Save preference to localStorage
  };

  const windUnitParam =
    settings.windSpeed === "km/h"
      ? "km/h"
      : settings.windSpeed === "m/s"
      ? "m/s"
      : settings.windSpeed === "Knots"
      ? "kt"
      : "default";

  const tempUnitParam =
    settings.temperature === "Fahrenheit" ? "°F" : "default";

  const rainUnitParam =
    settings.precipitation === "Millimeters"
      ? "mm"
      : settings.precipitation === "Inches"
      ? "in"
      : "default";

  const iframeSrc = `https://embed.windy.com/embed2.html?lat=${
    coordinates.lat
  }&lon=${coordinates.lon}&detailLat=${coordinates.lat}&detailLon=${
    coordinates.lon
  }&zoom=9&level=surface&overlay=${overlay}&menu=true&message=true&marker=true&pressure=true&type=map&location=coordinates${
    showSpotForecast ? "&detail=true" : ""
  }&metricWind=${windUnitParam}&metricTemp=${tempUnitParam}&metricRain=${rainUnitParam}&radarRange=-1`;

  return (
    <div className="flex flex-col gap-4">
      {/* Location Name */}
      <Header title={locationName} />
      {/* Overlay Buttons */}
      {!loading ? (
        <div className="flex flex-wrap items-center justify-start gap-1 mt-4">
          {overlayOptions.map((option) => (
            <button
              key={option}
              onClick={() => handleOverlayChange(option)}
              className={`px-4 py-1 rounded-full text-sm font-bold ${
                overlay === option
                  ? "bg-green-400 text-white font-bold border-green-500 border-2"
                  : "bg-slate-300 dark:bg-gray-800 dark:text-gray-300 font-bold dark:border-gray-500"
              }`}
            >
              {option}
            </button>
          ))}
          <button
            onClick={toggleSpotForecast}
            className={`px-4 py-1 rounded-full text-sm font-bold  ${
              showSpotForecast
                ? "bg-amber-200 dark:bg-yellow-400 border-2 dark:border-amber-500 border-amber-400"
                : "dark:bg-gray-800 bg-slate-300 dark:text-gray-300 font-bold dark:border-gray-500"
            } text-black`}
          >
            Forecast
          </button>
        </div>
      ) : (
        <>
          <div className="w-35 h-15 rounded-[10px] my-4  bg-slate-100 dark:bg-gray-800 animate-pulse"></div>
          <div className=" gap-1 bg-opacity-60 flex items-center justify-around animate-pulse">
            <div className=" flex justify-center items-center w-18 h-7 rounded-[20px]  bg-slate-100 dark:bg-gray-800"></div>
            <div className=" flex justify-center items-center w-18 h-7 rounded-[20px]  bg-slate-100 dark:bg-gray-800"></div>
            <div className=" flex justify-center items-center w-18 h-7 rounded-[20px]  bg-slate-100 dark:bg-gray-800"></div>
            <div className=" flex justify-center items-center w-18 h-7 rounded-[20px]  bg-slate-100 dark:bg-gray-800"></div>
            <div className=" flex justify-center items-center w-25 h-7 rounded-[20px]  bg-slate-100 dark:bg-gray-800"></div>
          </div>
        </>
      )}
      {/* Iframe with Loading */}
      <div
        className="relative w-full overflow-hidden rounded-[15px] shadow-md"
        style={{ height: `${windowHeight - 220}px` }}
      >
        {error && <p className="text-red-500">{error}</p>}
        {loading ? (
          <div className="absolute inset-0 bg-slate-100 dark:bg-gray-800 bg-opacity-60 flex items-center justify-center animate-pulse">
            {/* <p className="text-gray-500 dark:text-gray-300">
              Loading map, please wait...
            </p> */}
          </div>
        ) : (
          <iframe
            className="w-full h-full rounded-[15px]"
            src={iframeSrc}
            frameBorder="0"
            title="Windy Map"
          />
        )}
      </div>
    </div>
  );
};

export default WindyMapEmbed;
