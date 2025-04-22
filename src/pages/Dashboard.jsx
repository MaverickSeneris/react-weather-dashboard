import { Outlet, Link } from "react-router";
import { TiWeatherPartlySunny } from "react-icons/ti";
import { FaListUl } from "react-icons/fa6";
import { IoMapSharp } from "react-icons/io5";
import { VscSettings } from "react-icons/vsc";

function Dashboard() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 overflow-y-auto w-screen">
        <Outlet />
      </main>
      <nav className="sticky bottom-0 bg-gray-800 text-white p-4">
        {/* Nav Buttons*/}
        <div className="flex justify-around">
          <Link to="/" className="hover:text-yellow-400">
            <TiWeatherPartlySunny />
          </Link>
          <Link to="/city-list" className="hover:text-yellow-400">
            <FaListUl />
          </Link>
          <Link to="/weather-map" className="hover:text-yellow-400">
            <IoMapSharp />
          </Link>
          <Link to="/settings" className="hover:text-yellow-400">
            <VscSettings />
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default Dashboard;
