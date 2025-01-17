import axios from "axios";
import { useState } from "react";

export default function Chatbot() {
  const [response, setResponse] = useState<string>("Hi! How can I assist you?");
  const [value, setValue] = useState<string>("");
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
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
        <p>Chatbot:{response}</p>
        <div>
          <textarea value={value} onChange={onChange}></textarea>
        </div>
        <div>
          <button onClick={handleSubmit}>Send</button>
        </div>
      </div>
    </div>
  );
}
