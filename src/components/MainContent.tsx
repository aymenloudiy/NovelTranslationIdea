import Chatbot from "./Chatbot";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function MainContent() {
  return (
    <div className="container mx-auto px-4">
      <Navbar></Navbar>
      <main className="col-span-10 row-span-11 p-4 flex justify-stretch">
        <Chatbot></Chatbot>
      </main>
      <Footer></Footer>
    </div>
  );
}
