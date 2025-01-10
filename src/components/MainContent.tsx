import { ChangeEvent, useState } from "react";
interface MainContentInterface {
  textContent: string;
}
export default function MainContent({ textContent }: MainContentInterface) {
  const [content, setContent] = useState("");
  function handleContentChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setContent(e.currentTarget.value);
  }
  return (
    <div>
      <label htmlFor="">
        <textarea
          value={textContent}
          onChange={handleContentChange}
          name=""
          id=""
        ></textarea>
      </label>
      <div>
        <h2></h2>
        <div>
          <button>Raw</button>
          <button>Translated</button>
        </div>
        <p>{content}</p>
      </div>
    </div>
  );
}
