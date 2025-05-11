import { Outlet, Link, useLocation } from "react-router";
import { IoPartlySunnySharp } from "react-icons/io5";
import { FaListUl } from "react-icons/fa6";
import { IoMapSharp } from "react-icons/io5";
import { ImEqualizer } from "react-icons/im";

const navItems = [
  { to: "/", icon: IoPartlySunnySharp },
  { to: "/city-list", icon: FaListUl },
  { to: "/weather-map", icon: IoMapSharp },
  { to: "/settings", icon: ImEqualizer },
];

function Dashboard() {
  const { pathname } = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 overflow-y-auto w-screen">
        <Outlet />
      </main>
      <nav className="sticky bottom-0 bg-slate-100 dark:bg-gray-800 text-white p-4">
        <div className="flex justify-around">
          {navItems.map(({ to, icon: Icon }) => (
            <Link to={to} key={to}>
              <Icon
                className={`text-2xl ${
                  pathname === to
                    ? "text-slate-600 dark:text-gray-300"
                    : "text-slate-400 dark:text-gray-500"
                }`}
              />
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}

export default Dashboard;
