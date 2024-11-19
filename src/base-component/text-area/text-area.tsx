import { useEffect, useRef, useState } from "react";
import "./text-area.css";

interface TextAreaProps {
  placeholder: string;
  cssStyle: string;
  text: string;
  onChange: (text: string) => void;
  onEnterDown?: (event?: React.FormEvent<HTMLFormElement>) => void;
  isLocked?: boolean;
}

// we still need to handle the title and id portion

const TextArea = ({ placeholder, cssStyle, text, onChange, onEnterDown, isLocked }: TextAreaProps) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto"; // Reset the height to auto
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`; // Set it to the scroll height
    }
  }, [text]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    onChange(newText);
  };

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Else submit form
    if (e.key === "Enter" && !e.shiftKey && onEnterDown) {
      onEnterDown();
      onChange("");
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
