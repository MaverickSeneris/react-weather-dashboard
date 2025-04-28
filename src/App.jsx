import { BrowserRouter, Routes, Route } from "react-router";
import CurrentCity from "./pages/CurrentCity";
import CityList from "./pages/CityList";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import WeatherMap from "./pages/WeatherMap";
import CityOverview from "./components/CityOverview";
import CityWeatherDetail from "./pages/CityWeatherDetail";





function App() {
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
