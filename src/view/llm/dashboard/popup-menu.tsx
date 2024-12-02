import { useEffect } from "react";
import { LLMDashboardContextType } from "../../../context/llm-dashboard/context";
import { handleDeleteConvo } from "../../../api/llm-dashboard-api";

interface PopupMenuProps {
  toast: any;
  context: LLMDashboardContextType;
}

const PopupMenu = ({ toast, context }: PopupMenuProps) => {
  const { setUsername, setActiveMenuId, menuRef, menuPosition, setMenuPosition, setShowMoreInfo } = context;

  // Reset menu params
  const closeMenu = () => {
    setMenuPosition(null);
    setActiveMenuId(null);
  };

  // Used to check if we are scrolling - If so, close the menu
  useEffect(() => {
    const handleScroll = () => {
      if (menuPosition) {
        closeMenu();
      }
    };

    window.addEventListener("scroll", handleScroll, true);
    return () => {
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [menuPosition]);

  // Used to check if we clicked within the menu - If not, close the menu
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    if (menuPosition) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [menuPosition]);

  // Retrieve necessary information on initial mount
  useEffect(() => {
    const storedUsername = sessionStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  return (
    menuPosition && (
      <div ref={menuRef} className="title-info-menu" style={{ left: `${menuPosition.x}px`, top: `${menuPosition.y}px` }}>
        <button type="button" className="menu-button" onClick={() => setShowMoreInfo(true)}>
          🔍 More Info
        </button>
        <button type="button" className="menu-button delete" onClick={() => handleDeleteConvo(toast, context)}>
          🗑️ Delete
        </button>
      </div>
    )
  );
};

export default PopupMenu;
