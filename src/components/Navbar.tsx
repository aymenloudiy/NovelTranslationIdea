export default function Navbar() {
  return (
    <div>
      <nav className="flex justify-around gap-2">
        <div>
          <img src="" alt="Novel translation idea logo" />
        </div>
        <ul className="flex gap-2 grow justify-center">
          <li>
            <a href="#">Translate</a>
          </li>
          <li>
            <a href="#">Library</a>
          </li>
          <li>
            <a href="#">Dictionary</a>
          </li>
        </ul>
        <div>Settings</div>
      </nav>
    </div>
  );
}
