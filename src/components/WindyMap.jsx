import { useState, useEffect } from "react";
import Header from "./ui/Header";
import { useWeatherSettings } from "../utils/hooks/useWeatherSettings";

const overlayOptions = ["wind", "temp", "rain", "clouds"];

const WindyMapEmbed = () => {
  const [coordinates, setCoordinates] = useState({ lat: 14.6, lon: 121.0 });
  const [error, setError] = useState(null);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [overlay, setOverlay] = useState("wind");
  const [loading, setLoading] = useState(false);
  const [locationName, setLocationName] = useState("");
  const { settings } = useWeatherSettings(); // Access settings
  const [showSpotForecast, setShowSpotForecast] = useState(true);

  console.log(locationName);

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
          console.log(components);
          const town =
            components.village ||
            components.city ||
            components.town ||
            components.municipality ||
            components.county ||
            "Unknown location";
          setLocationName(town);
          console.log(town);
        } catch (err) {
          console.error("OpenCage error:", err);
          setLocationName("Unknown location");
        }
      },
      (err) => {
        console.error("Geolocation error:", err.message);
        setError("Failed to get your location. Showing default location.");
      }
    );

    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleOverlayChange = (option) => {
    setLoading(true);
    setOverlay(option);
    setTimeout(() => setLoading(false), 1000); // simulate loading
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

  // const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  // const embedType = prefersDark ? "dark" : "map";

  // const iframeSrc = `https://embed.windy.com/embed2.html?lat=${coordinates.lat}&lon=${coordinates.lon}&detailLat=${coordinates.lat}&detailLon=${coordinates.lon}&zoom=9&level=surface&overlay=${overlay}&menu=true&message=true&marker=true&pressure=true&type=map&location=coordinates&detail=true&metricWind=${windUnitParam}&metricTemp=${tempUnitParam}&metricRain=${rainUnitParam}&radarRange=-1`;
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
          onClick={() => setShowSpotForecast(!showSpotForecast)}
          className={`px-4 py-1 rounded-full text-sm font-bold  ${
            showSpotForecast
              ? "bg-amber-200 dark:bg-yellow-400 border-2 dark:border-amber-500 border-amber-400"
              : "dark:bg-gray-800 bg-slate-300 dark:text-gray-300 font-bold dark:border-gray-500"
          } text-black`}
        >
          Forecast
        </button>
      </div>
      {/* Iframe with Loading */}
      <div
        className="relative w-full overflow-hidden rounded-[15px] shadow-md"
        style={{ height: `${windowHeight - 220}px` }}
      >
        {error && <p className="text-red-500">{error}</p>}
        {loading && (
          <div className="absolute inset-0 z-10 bg-slate-100 dark:bg-gray-800 bg-opacity-60 flex items-center justify-center">
            <p className="dark:text-white font-semibold text-lg">
              Loading {overlay} map...
            </p>
          </div>
        )}
        <iframe
          className="w-full h-full rounded-[15px]"
          src={iframeSrc}
          frameBorder="0"
          title="Windy Map"
        />
      </div>
    </div>
  );
};

export default WindyMapEmbed;
