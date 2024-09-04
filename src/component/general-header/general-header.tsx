import { HiOutlineHome } from "react-icons/hi";
import { RiMenuAddFill } from "react-icons/ri";
import { HiOutlineBellAlert } from "react-icons/hi2";

import "./general-header.css";
import SearchBar from "../../base-component/search-bar/search-bar";

const GeneralHeader = () => {
  return (
    <>
      <button className="general-header-home-button">
        <HiOutlineHome />
      </button>
      <SearchBar cssProps="general-header-search-bar" />
      <div className="general-header-right-container">
        <button className="general-header-add-button">
          <RiMenuAddFill />
        </button>
        <button className="general-header-alert-button">
          <HiOutlineBellAlert />
        </button>
      </div>
    </>
  );
};

export default GeneralHeader;
