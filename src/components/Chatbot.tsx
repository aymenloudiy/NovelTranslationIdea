import { useState } from "react";

export default function Chatbot() {
  const [value, setValue] = useState<string>("");
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setValue(e.target.value);
  const handleSubmit = async () => {};
  return (
    <>
      <div>
        <textarea
          aria-label="novel chapter input"
          value={value}
          onChange={onChange}
          id="message"
          placeholder="Write your thoughts here..."
        ></textarea>
        <button onClick={handleSubmit}>Send</button>
      </div>
    </>
  );
}
