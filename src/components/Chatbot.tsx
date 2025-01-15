import axios from "axios";
import { useState } from "react";

export default function Chatbot() {
  const [response, setResponse] = useState<string>("Hi! How can I assist you?");
  const [value, setValue] = useState<string>("");
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setValue(e.target.value);
  const handleSubmit = async () => {
    const response = await axios.post("http://localhost:8081/chatbot", {
      question: value,
    });
    setResponse(response.data);
  };
  return (
    <div>
      <div className="container">
        <div>
          <input type="text" value={value} onChange={onChange}></input>
        </div>
        <div>
          <button>Send</button>
          <button onClick={handleSubmit}>Send</button>
        </div>
        <div>
          <p>Chatbot:{response}</p>
        </div>
      </div>
    </div>
  );
}
