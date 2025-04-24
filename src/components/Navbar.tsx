import { NavLink } from "react-router";

export default function Navbar() {
  return (
    <div>
      <nav className="flex justify-around gap-2">
        <div>
          <img src="" alt="Novel translation idea logo" />
        </div>
        <ul className="flex gap-2 grow justify-center">
          <li>
            <NavLink to={"/home"}>Home</NavLink>
          </li>
          <li>
            <NavLink to={"/library"}>Library</NavLink>
          </li>
          <li>
            <NavLink to={"/terms"}>Dictionary</NavLink>
          </li>
          <li>
            <NavLink to={"/settings"}>Settings</NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}
