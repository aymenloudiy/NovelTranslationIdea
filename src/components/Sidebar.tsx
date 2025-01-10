import Library from "./Library";
import Terms from "./Terms";
import Translate from "./Translate";

export default function Sidebar() {
  return (
    <div>
      <button>Collapse</button>
      <Translate></Translate>
      <Library></Library>
      <Terms></Terms>
    </div>
  );
}
