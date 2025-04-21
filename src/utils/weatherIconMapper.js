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



const iconMap = {
  "01d": clearSkyDay,
  "01n": clearSkyNight,
  "02d": partlyCloudyDay,
  "02n": partlyCloudyNight,
  "03d": scatteredCloudsDay,
  "03n": scatteredCloudsNight,
  "04d": brokenCloudsDay,
  "04n": brokenCloudsNight,
  "09d": showerRainDay,
  "09n": showerRainNight,
  "10d": rainDay,
  "10n": rainNight,
  "11d": thunderstormDay,
  "11n": thunderstormNight,
  "13d": snowDay,
  "13n": snowNight,
  "50d": mistDay,
  "50n": mistNight,

  // add more mappings here as needed
};

export default iconMap;
