import LabelButton from "../label-button/label-button";

import MenuButton from "../menu-button/menu-button";

import "./scroll-list.css";

interface ScrollListProps {
  placeholder?: string;
  values: string[];
  disabled?: boolean;
  // Callback that triggers on LabelButton click
  onDoubleClick?: () => void;
  enableMenu?: boolean;
  onMenuButtonClick?: (command: string, title: string) => void;
}

const ScrollList = ({ placeholder, values, disabled, onDoubleClick, enableMenu, onMenuButtonClick }: ScrollListProps) => {
  const printString = () => {
    console.log("Menu clicked");
  };

  return (
    <div className="scroll-list">
      {values.map((taskContent, index) => (
        <div key={index} className="scroll-button-container">
          <LabelButton name={taskContent} disabled={disabled} cssProps="scroll-button" />
          {/* {enableMenu && <MenuButton name="..." buttonList={["Open note", "Delete note"]} onButtonClick={printString} cssProps="delete-button" />} */}
        </div>
      ))}
    </div>
  );
};

export default ScrollList;
