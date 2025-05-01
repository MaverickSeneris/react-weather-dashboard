import { useState, useEffect } from "react";
import Header from "./ui/Header";

const overlayOptions = ["wind", "temp", "rain", "clouds"];

const WindyMapEmbed = () => {
  const [coordinates, setCoordinates] = useState({ lat: 14.6, lon: 121.0 });
  const [error, setError] = useState(null);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [overlay, setOverlay] = useState("wind");
  const [loading, setLoading] = useState(false);
  const [locationName, setLocationName] = useState("");

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

  const iframeSrc = `https://embed.windy.com/embed2.html?lat=${coordinates.lat}&lon=${coordinates.lon}&detailLat=${coordinates.lat}&detailLon=${coordinates.lon}&zoom=9&level=surface&overlay=${overlay}&menu=true&message=true&marker=true&pressure=true&type=map&location=coordinates&detail=true&metricWind=default&metricTemp=default&radarRange=-1`;

  return (
    <div className="flex flex-col gap-4">
      {/* Location Name */}
      <Header title={locationName} />
      {/* Overlay Buttons */}
      <div className="flex flex-wrap items-center justify-start gap-2 mt-4">
        {overlayOptions.map((option) => (
          <button
            key={option}
            onClick={() => handleOverlayChange(option)}
            className={`px-4 py-1 rounded-full text-sm font-bold border ${
              overlay === option
                ? "bg-green-500 text-white font-bold border-green-500"
                : "bg-gray-800 text-gray-300 font-bold border-gray-500"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      {/* Iframe with Loading */}
      <div
        className="relative w-full overflow-hidden rounded-[15px] shadow-md"
        style={{ height: `${windowHeight - 220}px` }}
      >
        {error && <p className="text-red-500">{error}</p>}
        {loading && (
          <div className="absolute inset-0 z-10 bg-gray-800 bg-opacity-60 flex items-center justify-center">
            <p className="text-white font-semibold text-lg">
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
