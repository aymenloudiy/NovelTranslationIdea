import Library from "./Library";
import Terms from "./Terms";
import Translate from "./Translate";

export default function Sidebar() {
  return (
    <nav className="col-span-3">
      <button>Collapse</button>
      <Translate></Translate>
      <Library></Library>
      <Terms></Terms>
    </nav>
  );
}
