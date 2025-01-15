import { useState } from "react";
export default function Chatbot() {
  const [response, setResponse] = useState<string>(
    "Hi! What would you like me to translate?"
  );
  const [value, setValue] = useState<string>("");
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setValue(e.target.value);
  return (
    <div>
      <div className="container">
        <div>
          <input type="text"></input>
          <input type="text" value={value} onChange={onChange}></input>
        </div>
        <div>
          <button>Send</button>
        </div>
        <div>
          <p>Chatbot:</p>
          <p>Chatbot:{response}</p>
        </div>
      </div>
    </div>
  );
}
