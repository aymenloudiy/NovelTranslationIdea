import "./App.css";
import MainContent from "./components/MainContent";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <>
      <div className="grid grid-cols-12 grid-rows-12 h-screen">
        <nav className="col-span-12 row-span-1 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <div className="px-3 py-3 lg:px-5 lg:pl-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-start rtl:justify-end">
                <a href="#" className="flex ms-2 md:me-24">
                  <img
                    src="https://flowbite.com/docs/images/logo.svg"
                    className="h-8 me-3"
                    alt="FlowBite Logo"
                  />
                  <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                    Title
                  </span>
                </a>
              </div>
            </div>
          </div>
        </nav>
        <Sidebar></Sidebar>
        <MainContent></MainContent>
      </div>
    </>
  );
}

export default App;
