import { NavLink } from "react-router";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 border-b border-gray-700 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <NavLink to="/home" className="text-xl font-bold text-white">
          Novel Translator
        </NavLink>

        <ul className="flex space-x-6 text-sm font-medium">
          <li>
            <NavLink
              to="/home"
              className={({ isActive }) =>
                isActive ? "text-blue-400" : "text-gray-300 hover:text-blue-400"
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/library"
              className={({ isActive }) =>
                isActive ? "text-blue-400" : "text-gray-300 hover:text-blue-400"
              }
            >
              Library
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/terms"
              className={({ isActive }) =>
                isActive ? "text-blue-400" : "text-gray-300 hover:text-blue-400"
              }
            >
              Terms
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                isActive ? "text-blue-400" : "text-gray-300 hover:text-blue-400"
              }
            >
              Settings
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
