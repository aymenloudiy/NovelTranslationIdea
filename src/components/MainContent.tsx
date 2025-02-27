import Chatbot from "./Chatbot";
import Navbar from "./Navbar";

export default function MainContent() {
  return (
    <>
      <Navbar></Navbar>
      <main className="col-span-10 row-span-11 p-4 flex justify-stretch">
        <Chatbot></Chatbot>
      </main>
    </>
  );
}
