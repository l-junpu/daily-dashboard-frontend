import "./search-bar.css";

import TextBox from "../text-box/text-box";
import LabelButton from "../label-button/label-button";

interface SearchBarProps {
  placeholder?: string;
  cssProps?: string;
}

const SearchBar = ({ placeholder = "Search...", cssProps }: SearchBarProps) => {
  return (
    <div className={`${cssProps} search-bar-container `}>
      <TextBox placeholder={placeholder} cssProps="search-bar" />
      <LabelButton name="Q" cssProps="search-button" />
    </div>
  );
};

export default SearchBar;
