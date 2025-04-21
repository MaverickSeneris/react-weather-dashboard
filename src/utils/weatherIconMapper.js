import clearSkyDay from "../assets/weather-icons/02_clear.svg";
import clearSkyNight from "../assets/weather-icons/02_clear_night.svg";
import partlyCloudyDay from "../assets/weather-icons/03_partly_cloudy.svg";
import partlyCloudyNight from "../assets/weather-icons/03_partly_cloudy_night.svg";
import scatteredCloudsDay from "../assets/weather-icons/04_cloudy_rn.svg";
import scatteredCloudsNight from "../assets/weather-icons/04_cloudy_night.svg";
import brokenCloudsDay from "../assets/weather-icons/04_cloudy_rn.svg";
import brokenCloudsNight from "../assets/weather-icons/04_cloudy_night.svg";
import showerRainDay from "../assets/weather-icons/11_showers.svg";
import showerRainNight from "../assets/weather-icons/11_showers_night.svg";
import rainDay from "../assets/weather-icons/12_rain.svg";
import rainNight from "../assets/weather-icons/12_rain_night.svg";
import thunderstormDay from "../assets/weather-icons/16_storms.svg";
import thunderstormNight from "../assets/weather-icons/16_storms_night.svg";
import snowDay from "../assets/weather-icons/15_snow.svg";
import snowNight from "../assets/weather-icons/15_snow_night.svg";
import mistDay from "../assets/weather-icons/10_fog.svg";
import mistNight from "../assets/weather-icons/10_fog_night.svg";

// iconMap maps OpenWeather API icon codes (e.g., "01d" for clear sky during the day)
// to local SVG files from the /assets/weather-icons/ directory. This allows us to display
// custom weather icons based on the data provided by OpenWeather.
//
// Example mapping:
// "01d" (clear sky during the day) maps to the local SVG icon '02_clear.svg' from the icons folder
//
// The mapping ensures that the correct weather icon is displayed for each weather condition.
// You can extend this map with more weather icon codes as needed.

const iconMap = {
  "01d": clearSkyDay, // Clear sky during the day
  "01n": clearSkyNight, // Clear sky during the night
  "02d": partlyCloudyDay, // Partly cloudy during the day
  "02n": partlyCloudyNight, // Partly cloudy during the night
  "03d": scatteredCloudsDay, // Scattered clouds during the day
  "03n": scatteredCloudsNight, // Scattered clouds during the night
  "04d": brokenCloudsDay, // Broken clouds during the day
  "04n": brokenCloudsNight, // Broken clouds during the night
  "09d": showerRainDay, // Shower rain during the day
  "09n": showerRainNight, // Shower rain during the night
  "10d": rainDay, // Rain during the day
  "10n": rainNight, // Rain during the night
  "11d": thunderstormDay, // Thunderstorm during the day
  "11n": thunderstormNight, // Thunderstorm during the night
  "13d": snowDay, // Snow during the day
  "13n": snowNight, // Snow during the night
  "50d": mistDay, // Mist during the day
  "50n": mistNight, // Mist during the night

  // Add more mappings here as needed to cover other weather types
};

export default iconMap;
