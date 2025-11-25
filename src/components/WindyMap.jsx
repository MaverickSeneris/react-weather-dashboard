import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "./ui/Header";
import { useWeatherSettings } from "../utils/hooks/useWeatherSettings";
import MapLoadingSkeleton from "./ui/loadingComponents/MapLoadingSkeleton";


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
    if (settings.location) {
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
    } else {
      setLoading(false);
      setLocationName("Default location");
    }

    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [settings.location]);

  const handleOverlayChange = (option) => {
    setOverlay(option);
    localStorage.setItem("overlayPreference", option); // Save preference to localStorage
  };

  const toggleSpotForecast = () => {
    const newValue = !showSpotForecast;
    setShowSpotForecast(newValue);
    localStorage.setItem("spotForecastPreference", JSON.stringify(newValue)); // Save preference to localStorage
  };

  // Convert unit settings to Windy API format
  // Windy embed API expects: "km/h" (URL encoded), "m/s" (URL encoded), "kt", "mph", or "bft"
  // The parameter values should match the display format, not abbreviations
  const getWindUnitParam = () => {
    const windSpeed = settings.windSpeed;
    const windSpeedLower = windSpeed?.toLowerCase();
    
    console.log("[WindyMap] Raw wind speed setting:", windSpeed);
    console.log("[WindyMap] Normalized:", windSpeedLower);
    
    // Windy expects the actual unit string, not abbreviations
    if (!windSpeed || windSpeedLower === "km/h" || windSpeedLower === "kmh") {
      console.log("[WindyMap] Using km/h");
      return "km/h"; // Windy expects "km/h" not "kph"
    }
    if (windSpeedLower === "m/s" || windSpeedLower === "ms" || windSpeedLower === "mps") {
      console.log("[WindyMap] Using m/s");
      return "m/s"; // Windy expects "m/s" not "ms"
    }
    if (windSpeedLower === "knots" || windSpeedLower === "kt" || windSpeedLower === "kts") {
      console.log("[WindyMap] Using kt");
      return "kt";
    }
    if (windSpeedLower === "mph") {
      console.log("[WindyMap] Using mph");
      return "mph";
    }
    
    console.log("[WindyMap] Unknown unit, defaulting to km/h");
    return "km/h"; // Default to km/h
  };

  const getTempUnitParam = () => {
    // Windy expects "°F" for Fahrenheit and "°C" for Celsius (with degree symbol)
    return settings.temperature?.toLowerCase() === "fahrenheit" ? "°F" : "°C";
  };

  const getRainUnitParam = () => {
    const precipLower = settings.precipitation?.toLowerCase();
    if (precipLower === "millimeters") return "mm";
    if (precipLower === "inches") return "in";
    return "default";
  };

  const windUnitParam = getWindUnitParam();
  const tempUnitParam = getTempUnitParam();
  const rainUnitParam = getRainUnitParam();

  // Create a unique key based on unit settings to force iframe re-render when settings change
  const settingsKey = `${windUnitParam}-${tempUnitParam}-${rainUnitParam}`;
  
  // Build iframe URL with unit parameters
  // Windy requires URL encoding for parameters with special characters like "/"
  const encodedWindUnit = encodeURIComponent(windUnitParam);
  const encodedTempUnit = encodeURIComponent(tempUnitParam);
  const encodedRainUnit = encodeURIComponent(rainUnitParam);
  
  const iframeSrc = `https://embed.windy.com/embed2.html?lat=${
    coordinates.lat
  }&lon=${coordinates.lon}&detailLat=${coordinates.lat}&detailLon=${
    coordinates.lon
  }&zoom=9&level=surface&overlay=${overlay}&menu=true&message=true&marker=true&pressure=true&type=map&location=coordinates${
    showSpotForecast ? "&detail=true" : ""
  }&metricWind=${encodedWindUnit}&metricTemp=${encodedTempUnit}&metricRain=${encodedRainUnit}&radarRange=-1`;
  
  // Debug logging
  console.log("[WindyMap] Final iframe URL params:", {
    windUnit: windUnitParam,
    encodedWindUnit: encodedWindUnit,
    tempUnit: tempUnitParam,
    rainUnit: rainUnitParam,
    fullUrl: iframeSrc
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Location Name */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 300,
          delay: 0.1,
        }}
      >
      <Header title={locationName} />
      </motion.div>
      {/* Overlay Buttons */}
      {!loading ? (
        <motion.div
          className="flex flex-wrap items-center justify-start gap-1 mt-4"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
              },
            },
          }}
        >
          {overlayOptions.map((option, index) => (
            <motion.button
              key={option}
              onClick={() => handleOverlayChange(option)}
              variants={{
                hidden: {
                  opacity: 0,
                  scale: 0.8,
                  y: 10,
                },
                visible: {
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  transition: {
                    type: "spring",
                    damping: 20,
                    stiffness: 300,
                  },
                },
              }}
              whileHover={{
                scale: 1.1,
                y: -2,
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-1 rounded-full text-sm font-bold border-2"
              style={{
                backgroundColor: overlay === option ? 'var(--green)' : 'var(--bg-1)',
                color: overlay === option ? 'var(--bg-0)' : 'var(--fg)',
                borderColor: overlay === option ? 'var(--green)' : 'var(--bg-2)'
              }}
            >
              {option}
            </motion.button>
          ))}
          <motion.button
            onClick={toggleSpotForecast}
            variants={{
              hidden: {
                opacity: 0,
                scale: 0.8,
                y: 10,
              },
              visible: {
                opacity: 1,
                scale: 1,
                y: 0,
                transition: {
                  type: "spring",
                  damping: 20,
                  stiffness: 300,
                },
              },
            }}
            whileHover={{
              scale: 1.1,
              y: -2,
              transition: { duration: 0.2 },
            }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-1 rounded-full text-sm font-bold border-2"
            style={{
              backgroundColor: showSpotForecast ? 'var(--yellow)' : 'var(--bg-1)',
              color: showSpotForecast ? 'var(--bg-0)' : 'var(--fg)',
              borderColor: showSpotForecast ? 'var(--yellow)' : 'var(--bg-2)'
            }}
          >
            Forecast
          </motion.button>
        </motion.div>
      ) : (
       <MapLoadingSkeleton />
      )}
      {/* Iframe with Loading */}
      <div
        className="relative w-full overflow-hidden rounded-[15px] shadow-md"
        style={{ height: `${windowHeight - 220}px` }}
      >
        {error && <p className="text-red-500">{error}</p>}
        {loading ? (
          <div className="absolute inset-0 bg-opacity-60 flex items-center justify-center animate-pulse" style={{ backgroundColor: 'var(--bg-1)' }}>
            {/* <p className="text-gray-500 dark:text-gray-300">
              Loading map, please wait...
            </p> */}
          </div>
        ) : (
          <iframe
            key={settingsKey}
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
