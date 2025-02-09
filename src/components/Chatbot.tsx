import axios from "axios";
import { useState } from "react";

export default function Chatbot() {
  const [, setResponse] = useState<string>("Hi! How can I assist you?");
  const [value, setValue] = useState<string>("");
  const url = "http://localhost:8081";
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setValue(e.target.value);
  const handleSubmit = async () => {
    const response = await axios.post(`${url}/api/translate`, {
      question: value,
    });
    const text = response.data.translated_text;
    const dict = response.data.dictionary;
    await axios.post(`${url}/api/dictionaries/novel/novelID`, { dict }); // TODO: Add novelID and novel name, find a way to fix this bs sourceTerm, targetTerm, sourceLanguage, targetLanguage
    await axios.post(`${url}/api/translations/nove/novelID`, { text }); // TODO: Same issue above
    setResponse(text);
  };
  return (
    <>
      <textarea
        aria-label="novel chapter input"
        value={value}
        onChange={onChange}
        id="message"
        placeholder="Write your thoughts here..."
      ></textarea>
      <button onClick={handleSubmit}>Send</button>
    </>
  );
}
