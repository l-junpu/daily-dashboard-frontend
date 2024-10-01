import "./icon-button.css";

import { useState } from "react";

interface IconButtonProps {
  primaryText: string;
  hoverText?: string;
  baseStyle?: string;
  cssStyle?: string;
  hoverCssStyle?: string;
  onClick: () => void;
}

const IconButton = ({ primaryText, hoverText, baseStyle, cssStyle, hoverCssStyle, onClick }: IconButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div className={baseStyle} style={{ position: "relative" }}>
      <button onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={onClick} className={cssStyle}>
        {primaryText}
      </button>
      {isHovered && hoverText && <span className={`${hoverCssStyle} icon-button-hover-text`}>{hoverText}</span>}
    </div>
  );
};

export default IconButton;
