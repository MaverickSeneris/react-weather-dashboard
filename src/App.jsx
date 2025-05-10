import { BrowserRouter, Routes, Route } from "react-router";
import { useEffect } from "react";
import CurrentCity from "./pages/CurrentCity";
import CityList from "./pages/CityList";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import WeatherMap from "./pages/WeatherMap";
import CityOverview from "./components/CityOverview";
import CityWeatherDetail from "./pages/CityWeatherDetail";
import { useWeatherSettings } from "./utils/hooks/useWeatherSettings";


function App() {
  const { settings } = useWeatherSettings();

  useEffect(() => {
    const themeColor = settings.dark ? "#1f2937" : "#ffffff"; // dark: Tailwind gray-800
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "theme-color";
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", themeColor);
  }, [settings.dark]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Dashboard />}>
          <Route index element={<CurrentCity />} />
          <Route path="city-list" element={<CityList />} />
          <Route path="weather-map" element={<WeatherMap />} />
          <Route path="settings" element={<Settings />} />
          <Route path="test/:id" element={<CityOverview />} />
          <Route path="city/:id" element={<CityWeatherDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
