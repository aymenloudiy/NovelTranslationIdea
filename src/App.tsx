import "./App.css";
import MainContent from "./components/MainContent";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <div className="grid grid-cols-12 h-screen">
      <Sidebar></Sidebar>
      <MainContent></MainContent>
    </div>
  );
}

export default App;
