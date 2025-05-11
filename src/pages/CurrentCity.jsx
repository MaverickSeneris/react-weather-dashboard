import React, { useState, useEffect } from "react";
import axios from "axios";
import iconMap from "../utils/weatherIconMapper";
import formatTime from "../utils/timeFormatter";
import getDayLabel from "../utils/dayLabel";
import CurrentCityContainer from "../components/CurrentCityContainer";
import HourlyContainer from "../components/HourlyContainer";
import DailyContainer from "../components/DailyContainer";
import CurrentWeatherContainer from "../components/CurrentWeatherContainer";
import generateUUID from "../utils/uuidGenerator";

function LoadingSkeleton() {
  return (
    <div className="flex flex-col items-center w-screen px-4 mt-10 pb-2 animate-pulse">
      <div className="w-40 h-12 bg-gray-300 rounded-[15px] mb-4"></div>
      <div className="w-50 h-8 bg-gray-300 rounded-[10px] mb-4"></div>
      <div className="w-50 h-50 bg-gray-300 rounded-[50%] mb-4"></div>
      <div className="w-29 h-15 bg-gray-300 rounded-[15px] my-6"></div>
      <div className="w-full h-24 bg-gray-300 rounded-[15px] mb-4 mt-2"></div>
      <div className="w-full h-40 bg-gray-300 rounded-[15px] mb-4"></div>
      <div className="w-full h-30 bg-gray-300 rounded-[15px]"></div>
    </div>
  );
}

function CurrentCity() {
  const [currentWeatherInfo, setCurrentWeatherInfo] = useState(null);
  const [unit, setUnit] = useState("metric");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        fetchAllWeatherInfo(latitude, longitude);
      },
      (error) => {
        console.error("❌ Geolocation error:", error.message);
      }
    );
  }, [unit]);

  const fetchLocation = async (lat, lon) => {
    console.log("⏳ Loading location data...");
    try {
      const geoKey = import.meta.env.VITE_OPENCAGE_API_KEY;
      const res = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${geoKey}`
      );
      const c = res.data.results[0].components;

      console.log("🌍 Location data:", c);

      setCurrentLocation({
        town: c.town || "",
        state: c.state || "",
        country: c.country || "",
        village: c.village || "",
        region: c.region || "",
      });
    } catch (err) {
      console.error(
        "❌ Error in [CurrentCity.jsx > fetchLocation()] —  possibly at line 51",
        err
      );
    }
  };

  const fetchAllWeatherInfo = async (lat, lon) => {
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

      setCurrentWeatherInfo({
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
      });
    } catch (err) {
      console.error("\u274c Error in fetchAllWeatherInfo():", err);
    }
  };

  if (!currentWeatherInfo) return <LoadingSkeleton />;

  return (
    <div className="flex flex-col items-center w-screen px-4 mt-10 pb-2">
      <CurrentCityContainer
        cityName={currentWeatherInfo.location.village}
        popValue={currentWeatherInfo.current.chanceOfRain}
        weatherIcon={iconMap[currentWeatherInfo.current.weatherIcon]}
        tempValue={currentWeatherInfo.current.temperature}
      />

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
