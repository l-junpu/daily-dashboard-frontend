import React, { useState } from "react";
import "./text-box.css";

interface TextBoxProps {
    placeholder?: string;
    cssProps?: string;
    onChange?: (value: string) => void;
}

function TextBox({ placeholder, cssProps, onChange }: TextBoxProps) {
    const [inputValue, setInputValue] = useState("");

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setInputValue(newValue);
        if (onChange) {
            onChange(newValue);
        }
    };

    return <input type="text" className={`text-box ${cssProps}`} placeholder={placeholder} value={inputValue} onChange={handleChange} />;
}

export default TextBox;