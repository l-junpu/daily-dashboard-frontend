// hamburger menu
import "./menu-button.css"

import { useState } from "react";
import { IoMenu } from "react-icons/io5";

interface MenuButtonProp {
    ButtonList: string[];
    Title: string;
    OnButtonClick(command: string, title: string): void;
    CssProp?: string;
}

export const MenuButton = ({ ButtonList, Title, OnButtonClick, CssProp }: MenuButtonProp) => {
    const [enableMenu, setEnableMenu] = useState(Boolean);

    const HandleMouseOver = (status: boolean) => {
        setEnableMenu(status);
    };

    return (
        <div style={{ position: "absolute", left: "236px", border: "none" }}>
            <button onMouseEnter={() => HandleMouseOver(true)} onMouseLeave={() => HandleMouseOver(false)} className={CssProp}>
                <IoMenu />
                {enableMenu && ButtonList.length > 0 && (
                    <div className="popup-overlay">
                        {ButtonList.map((command, index) => (
                            <p className="popup-content" key={index} onClick={() => OnButtonClick(command, Title)}>
                                {command}
                            </p>
                        ))}
                    </div>
                )}
            </button>
        </div>
    );
};