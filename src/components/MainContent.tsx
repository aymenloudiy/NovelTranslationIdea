import Chatbot from "./Chatbot";
export default function MainContent() {
  return (
    <main className="col-span-9">
      <Chatbot></Chatbot>
      <div>
        <div>
          <button>Raw</button>
          <button>Translated</button>
        </div>
      </div>
    </main>
  );
}
