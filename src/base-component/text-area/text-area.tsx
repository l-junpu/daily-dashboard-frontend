import { useEffect, useRef, useState } from "react";
import "./text-area.css";

interface TextAreaProps {
  placeholder: string;
  cssStyle: string;
  onChange?: (text: string) => void;
  onEnterDown?: () => void;
  isLocked?: boolean;
}

const TextArea = ({ placeholder, cssStyle, onChange, onEnterDown, isLocked }: TextAreaProps) => {
  const [text, setText] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto"; // Reset the height to auto
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`; // Set it to the scroll height
    }
  }, [text]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    if (onChange) {
      onChange(newText);
    }
  };

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && onEnterDown) {
      onEnterDown();
      setText("");
    }
  };

  return (
    <textarea
      ref={textAreaRef}
      className={cssStyle}
      placeholder={placeholder}
      value={text}
      onChange={handleChange}
      onKeyDown={handleOnKeyDown}
      readOnly={isLocked}
    ></textarea>
  );
};

export default TextArea;
