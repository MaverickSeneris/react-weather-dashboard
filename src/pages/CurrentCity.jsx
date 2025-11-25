import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import axios from "axios";
import { FiRefreshCw } from "react-icons/fi";
import iconMap from "../utils/weatherIconMapper";
import formatTime from "../utils/timeFormatter";
import getDayLabel from "../utils/dayLabel";
import CurrentCityContainer from "../components/CurrentCityContainer";
import HourlyContainer from "../components/HourlyContainer";
import DailyContainer from "../components/DailyContainer";
import CurrentWeatherContainer from "../components/CurrentWeatherContainer";
import generateUUID from "../utils/uuidGenerator";
import LoadingSkeleton from "../components/ui/loadingComponents/CurrentCityLoadingSkeleton";
import { useWeatherSettings } from "../utils/hooks/useWeatherSettings";
import { checkWeatherAlerts } from "../utils/notifications";
import WeatherRecommendations from "../components/WeatherRecommendations";
import WeatherAlerts from "../components/WeatherAlerts";
import { useSwipeToRefresh } from "../utils/hooks/useSwipeToRefresh";

function CurrentCity() {
  const [currentWeatherInfo, setCurrentWeatherInfo] = useState(
    JSON.parse(localStorage.getItem("weatherData")) || null
  );
  const [lastFetchTime, setLastFetchTime] = useState(
    localStorage.getItem("lastFetchTime") || null
  );
  const [unit, setUnit] = useState("metric");
  const [loading, setLoading] = useState(false);
  const { settings } = useWeatherSettings();
  const containerRef = useRef(null);

  // Only fetch on initial load if no data exists
  useEffect(() => {
    if (!currentWeatherInfo && settings.location) {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => {
          fetchAllWeatherInfo(latitude, longitude);
        },
        (error) => {
          console.error("❌ Geolocation error:", error.message);
        }
      );
    }
  }, []); // Only run once on mount

  const fetchAllWeatherInfo = async (lat, lon) => {
    setLoading(true);
    try {
      const geoKey = import.meta.env.VITE_OPENCAGE_API_KEY;
      const weatherUrl = import.meta.env.VITE_OPENWEATHER_ONECALL_API_URL;
      const weatherKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

      const [geoRes, weatherRes] = await Promise.all([
        axios.get(
          `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${geoKey}`
        ),
        axios.get(
          `${weatherUrl}lat=${lat}&lon=${lon}&appid=${weatherKey}&units=${unit}`
        ),
      ]);

      const locationData = geoRes.data.results[0].components;
      const data = weatherRes.data;

      const hourlyData = data.hourly
        .filter((_, i) => i >= 2 && (i - 2) % 3 === 0)
        .slice(0, 3)
        .map((d) => ({
          time: formatTime(d.dt, settings.timeFormat),
          temperature: d.temp,
          icon: d.weather?.[0]?.icon,
        }));

      const dailyData = data.daily.slice(0, 7).map((d, i) => ({
        day: getDayLabel(d.dt, i),
        icon: d.weather[0]?.icon || "",
        description: d.weather[0]?.description || "",
        tempHigh: Math.round(d.temp.max),
        tempLow: Math.round(d.temp.min),
      }));

      const weatherInfo = {
        cityId: generateUUID(),
        location: {
          town: locationData.town || "",
          state: locationData.state || "",
          country: locationData.country || "",
          village: locationData.village || "",
          region: locationData.region || "",
        },
        current: {
          temperature: Math.floor(data.current.temp),
          weatherIcon: data.current.weather[0]?.icon || "",
          description: data.current.weather[0]?.description || "",
          feelsLike: Math.floor(data.current.feels_like),
          uvIndex: Math.ceil(data.current.uvi),
          windSpeed: data.current.wind_speed,
          chanceOfRain: Math.round(data.daily?.[0]?.pop * 100) ?? 0,
          pressure: data.current.pressure,
          visibility: data.current.visibility,
          humidity: data.current.humidity,
          sunset: data.current.sunset,
          sunrise: data.current.sunrise,
        },
        hourly: {
          time: hourlyData.map((i) => i.time),
          temperature: hourlyData.map((i) => i.temperature),
          icon: hourlyData.map((i) => i.icon),
        },
        daily: dailyData,
      };

      setCurrentWeatherInfo(weatherInfo);
      localStorage.setItem("weatherData", JSON.stringify(weatherInfo));

      const fetchTime = new Date().toLocaleString();
      setLastFetchTime(fetchTime);
      localStorage.setItem("lastFetchTime", fetchTime);

      // Check for weather alerts and send notifications if enabled
      checkWeatherAlerts(weatherInfo);
    } catch (err) {
      console.error("\u274c Error in fetchAllWeatherInfo():", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (settings.location) {
      return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => {
            fetchAllWeatherInfo(latitude, longitude).then(resolve).catch(reject);
        },
        (error) => {
          console.error("❌ Geolocation error:", error.message);
            reject(error);
        }
      );
      });
    }
  };

  // Swipe to refresh hook
  const { pullDistance, isRefreshing } = useSwipeToRefresh(handleRefresh, {
    enabled: !!currentWeatherInfo && settings.location,
  });

  if (!currentWeatherInfo || loading) return <LoadingSkeleton />;

  // Lazy loading wrapper component with alternating sides
  const LazySection = ({ children, index, className = "" }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    const isEven = index % 2 === 0;

    return (
      <motion.div
        ref={ref}
        initial={{ 
          opacity: 0, 
          x: isEven ? -100 : 100,
          scale: 0.85
        }}
        animate={isInView ? { 
          opacity: 1, 
          x: 0,
          scale: 1
        } : { 
          opacity: 0, 
          x: isEven ? -100 : 100,
          scale: 0.85
        }}
        transition={{ 
          type: "spring", 
          damping: 15, 
          stiffness: 200,
          delay: 0.15,
          duration: 0.6
        }}
        className={className}
      >
        {children}
      </motion.div>
    );
  };

  return (
    <div 
      ref={containerRef}
      className="flex flex-col items-center w-screen px-4 mt-10 pb-2"
    >
      {/* Pull to refresh indicator */}
      {pullDistance > 0 && (
        <motion.div
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center py-2"
          style={{
            backgroundColor: 'var(--bg-0)',
            transform: `translateY(${Math.min(pullDistance, 80)}px)`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: pullDistance > 20 ? 1 : 0 }}
        >
          <motion.div
            animate={{ rotate: isRefreshing ? 360 : 0 }}
            transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0, ease: "linear" }}
        style={{ color: 'var(--fg)' }}
      >
            <FiRefreshCw size={24} />
          </motion.div>
        </motion.div>
      )}

      <LazySection index={0}>
      <CurrentCityContainer
        cityName={currentWeatherInfo.location.village}
        popValue={currentWeatherInfo.current.chanceOfRain}
        weatherIcon={iconMap[currentWeatherInfo.current.weatherIcon]}
        tempValue={currentWeatherInfo.current.temperature}
      />
      </LazySection>
      
      {lastFetchTime && (
        <LazySection index={1}>
        <p className="text-[0.7rem]" style={{ color: 'var(--gray)' }}>
          Last updated: {lastFetchTime}
        </p>
        </LazySection>
      )}

      <LazySection index={2} className="w-full">
      <HourlyContainer hourlyWeatherInfo={currentWeatherInfo.hourly} />
      </LazySection>
      
      <LazySection index={3} className="w-full">
      <DailyContainer dailyWeatherInfo={currentWeatherInfo.daily} />
      </LazySection>
      
      {/* Weather Alerts - only shows if there are alarming conditions */}
      <LazySection index={4} className="w-full">
      <WeatherAlerts weatherData={currentWeatherInfo} />
      </LazySection>
      
      <LazySection index={5} className="w-full">
      <CurrentWeatherContainer
        currentWeatherInfo={currentWeatherInfo.current}
        cityName={currentWeatherInfo.location.village}
      />
      </LazySection>
      
      {/* Weather Recommendations */}
      <LazySection index={6} className="w-full">
      <WeatherRecommendations weatherData={currentWeatherInfo} />
      </LazySection>
    </div>
  );
}

export default CurrentCity;
