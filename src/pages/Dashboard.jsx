import { Outlet, Link, useLocation } from "react-router";
import { TiWeatherPartlySunny } from "react-icons/ti";
import { FaListUl } from "react-icons/fa6";
import { IoMapSharp } from "react-icons/io5";
import { ImEqualizer } from "react-icons/im";
import { useWeatherSettings } from "../utils/hooks/useWeatherSettings";


function Dashboard() {
  const { settings} = useWeatherSettings()
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 overflow-y-auto w-screen">
        <Outlet />
      </main>
      <nav className={`sticky bottom-0 ${settings.dark ? "bg-gray-800" : "bg-gray-100"} text-white p-4`}>
        {/* Nav Buttons*/}
        <div className="flex justify-around">
          <Link
            to="/"
            className={`text-2xl ${
              path === "/" ? "text-gray-300" : "text-gray-500"
            }`}
          >
            <TiWeatherPartlySunny
              className={`text-2xl ${
                path === "/" ? "text-gray-300" : "text-gray-500"
              }`}
            />
          </Link>
          <Link to="/city-list">
            <FaListUl
              className={`text-2xl ${
                path === "/city-list" ? "text-gray-300" : "text-gray-500"
              }`}
            />
          </Link>
          <Link to="/weather-map">
            <IoMapSharp
              className={`text-2xl ${
                path === "/weather-map" ? "text-gray-300" : "text-gray-500"
              }`}
            />
          </Link>
          <Link to="/settings">
            <ImEqualizer
              className={`text-2xl ${
                path === "/settings" ? "text-gray-300" : "text-gray-500"
              }`}
            />
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default Dashboard;
