import { useState } from "react";
import LabelButton from "../label-button/label-button";

import { MenuButton } from "../menu-button/menu-button";

import "./scroll-list.css"

// Component Props
interface ScrollbarProps {
    // Placeholder String
    placeholder?: string;

    // List of Values displayed as LabelButtons
    values: string[];
    disabled?: boolean;
    // Callback that triggers on LabelButton click
    onSelect?: (username: string, title: string) => void;
    OnHamburgerButtonClick?: (command: string, title: string) => void;
}

// Scrollbar Component
const ScrollList = ({ placeholder, values, disabled, onSelect, OnHamburgerButtonClick }: ScrollbarProps) => {
    const [activeButton, setActiveButton] = useState("");

    // Handle the onClick event when a LabelButton is clicked
    const handleOnClick = (username: string, title: string) => {
        if (onSelect != undefined) {
            // Call the onClick Callback Function
            onSelect(username, title);
            // Enable "active" className for "title"
            setActiveButton(title);
        }

    };

    return (
        <div className="scrollbarStyle">
            <div>
                {values ? (
                    /*
                    For all Values within "values", generate a LabelButton 
                    and assign a Callback Function to it "onClick"
                  */
                    values.map((titleName, index) => (
                        <div className="verticalStyle">
                            <LabelButton
                                key={index}
                                name={titleName}
                                disabled={disabled}
                            />
                        </div>
                    ))
                ) : (
                    <p>{placeholder}</p>
                )}
            </div>
        </div>
    );
};

export default ScrollList;