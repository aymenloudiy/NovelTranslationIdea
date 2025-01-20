import Chatbot from "./Chatbot";
export default function MainContent() {
  return (
    <main className="col-span-10 row-span-11 p-4 flex justify-stretch">
      <Chatbot></Chatbot>

      {/* <div>
          <button>Raw</button>
          <button>Translated</button>
        </div> */}
    </main>
  );
}
