import Chatbot from "./Chatbot";
export default function MainContent() {
  return (
    <main>
      <label htmlFor="">
        <Chatbot></Chatbot>
      </label>
      <div>
        <h2></h2>
        <div>
          <button>Raw</button>
          <button>Translated</button>
        </div>
        <p></p>
      </div>
    </main>
  );
}
