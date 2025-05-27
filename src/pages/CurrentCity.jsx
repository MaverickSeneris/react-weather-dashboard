import { useState, useEffect } from "react";
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

function CurrentCity() {
  const [currentWeatherInfo, setCurrentWeatherInfo] = useState(
    JSON.parse(localStorage.getItem("weatherData")) || null
  );
  const [lastFetchTime, setLastFetchTime] = useState(
    localStorage.getItem("lastFetchTime") || null
  );
  const [unit, setUnit] = useState("metric");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentWeatherInfo) {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => {
          fetchAllWeatherInfo(latitude, longitude);
        },
        (error) => {
          console.error("❌ Geolocation error:", error.message);
        }
      );
    }
  }, [unit]);

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
          time: formatTime(d.dt),
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
    } catch (err) {
      console.error("\u274c Error in fetchAllWeatherInfo():", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        fetchAllWeatherInfo(latitude, longitude);
      },
      (error) => {
        console.error("❌ Geolocation error:", error.message);
      }
    );
  };

  if (!currentWeatherInfo || loading) return <LoadingSkeleton />;

  return (
    <div className="flex flex-col items-center w-screen px-4 mt-10 pb-2">
      <button
        onClick={handleRefresh}
        className="self-start p-2 thyuvgfext-slate-300 dark:text-white rounded-full hover:bg-blue-600"
      >
        <FiRefreshCw size={20} />
      </button>

      <CurrentCityContainer
        cityName={currentWeatherInfo.location.village}
        popValue={currentWeatherInfo.current.chanceOfRain}
        weatherIcon={iconMap[currentWeatherInfo.current.weatherIcon]}
        tempValue={currentWeatherInfo.current.temperature}
      />
      {lastFetchTime && (
        <p className="text-[0.7rem] text-slate-300 dark:text-gray-500">
          Last updated: {lastFetchTime}
        </p>
      )}

      <HourlyContainer hourlyWeatherInfo={currentWeatherInfo.hourly} />
      <DailyContainer dailyWeatherInfo={currentWeatherInfo.daily} />
      <CurrentWeatherContainer
        currentWeatherInfo={currentWeatherInfo.current}
        cityName={currentWeatherInfo.location.village}
      />
    </div>
  );
}

export default CurrentCity;
