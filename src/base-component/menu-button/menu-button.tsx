// hamburger menu
import "./menu-button.css";

import { useState } from "react";
import { IoMenu } from "react-icons/io5";

interface MenuButtonProp {
  name: string;
  buttonList: string[];
  onButtonClick: () => void;
  cssProps?: string;
}

const MenuButton = ({ name, buttonList, onButtonClick, cssProps }: MenuButtonProp) => {
  const [enableMenu, setEnableMenu] = useState(Boolean);

  const HandleMouseOver = (status: boolean) => {
    setEnableMenu(status);
  };

  return (
    <div className="menu-button-container">
      <button onMouseEnter={() => HandleMouseOver(true)} onMouseLeave={() => HandleMouseOver(false)} className={cssProps}>
        <IoMenu />
        {enableMenu && buttonList.length > 0 && (
          <div className="menu">
            {buttonList.map((command, index) => (
              <p className="menu-item" key={index} onClick={onButtonClick}>
                {command}
              </p>
            ))}
          </div>
        )}
      </button>
    </div>
  );
};

export default MenuButton;
