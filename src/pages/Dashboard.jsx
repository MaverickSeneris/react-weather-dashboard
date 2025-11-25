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
      <nav className="sticky bottom-0 p-4" style={{ backgroundColor: 'var(--bg-1)' }}>
        <div className="flex justify-around">
          {navItems.map(({ to, icon: Icon }) => (
            <Link to={to} key={to}>
              <Icon
                className="text-2xl"
                style={{
                  color: pathname === to ? 'var(--fg)' : 'var(--gray)'
                }}
              />
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}

export default Dashboard;
