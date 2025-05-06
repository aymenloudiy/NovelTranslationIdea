import { Outlet } from "react-router";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Navbar />
      <main className="flex-grow px-4 sm:px-6 lg:px-8 w-full max-w-screen-xl mx-auto">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
