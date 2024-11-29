import "./llm-dashboard.css";

// General use
import React, { useState } from "react";
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import IconButton from "../../../base-component/icon-button/icon-button";

import {
  handleGetTagsAndDocumentsFromChroma,
  handleGetTitlesFromUserApi,
  handleRetrieveConvoHistory,
} from "../../../api/llm-dashboard-api";

import { LLMDashboardContext } from "../../../context/llm-dashboard/context";
import { CreateChatView } from "./create-chat";
import { LLMPrimaryContents } from "./primary-contents";
import { ScrollViewComponent } from "../../../base-component/scroll-view-component/scroll-view-component";
import { TitleInfo } from "../../../data/llm-data";

const LLMDashboardView = () => {
  const context = React.useContext(LLMDashboardContext);
  if (!context) {
    toast.error("Unable to retrieve LLM Dashboar Context");
    return;
  }

  const { navigate, username, setUsername, createChat, setCreateChat, titles, setTitles, activeTitleId, setActiveTitleId } = context;

  // Testing Menu Popup
  const [activeMenu, setActiveMenu] = useState(false);
  const [anchor, setAnchorPoint] = useState({ x: 0, y: 0 });

  const handleToggleMenu = (event: React.MouseEvent<HTMLButtonElement>, status: boolean) => {
    event.preventDefault();
    setAnchorPoint({ x: event.clientX, y: event.clientY });
    setActiveMenu(status);
  };

  // Retrieve necessary information on initial mount
  useEffect(() => {
    const storedUsername = sessionStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  // Retrieve Titles on Username Update
  useEffect(() => {
    if (username === null) return;

    // We need an async function to await
    const initialize = async () => {
      await handleGetTitlesFromUserApi(toast, username, setTitles);
    };

    // Handle Initial Retrieve Titles
    initialize();
  }, [username]);

  return (
    <>
      <ToastContainer position="bottom-right" />
      <div className="dashboard-container">
        {/* Dashboard Header */}
        <header className="dashboard-header">
          <div className="title">SOBA AI</div>
        </header>
        <div className="dashboard-body">
          {/* Redirection to the 2 main applications */}
          <nav className="primary-navbar">
            <IconButton
              primaryText="📋"
              hoverText="Tasks"
              cssStyle="button"
              onClick={() => navigate("/dashboard/tasks", { replace: true })}
            />
            <IconButton primaryText="💻" hoverText="LLM" cssStyle="button primary-selected" onClick={() => {}} />
          </nav>

          <nav className="secondary-navbar">
            {/* Secondary Navbar - Page Navigation */}
            <p className="prefix">DASHBOARD</p>
            <div style={{ marginBottom: "6px" }}>
              <button className={"selected-button"}>{"📋 Conversations"}</button>
              <button
                className={"button"}
                onClick={() => {
                  navigate("/dashboard/llm/inspect-db", { replace: true });
                }}
              >
                {"🔍 View Embeddings"}
              </button>
              <button
                className={"button"}
                onClick={() => {
                  navigate("/dashboard/llm/upload-docs", { replace: true });
                }}
              >
                {"⚙️ Add Embeddings"}
              </button>
            </div>

            <hr className="secondary-navbar-hr"></hr>

            {/* Secondary Navbar - Chat History Display */}
            <ScrollViewComponent
              header="CHAT HISTORY"
              defaultActionButton={true}
              defaultActionButtonName="✚ New Chat"
              onClickDefaultActionButton={() => {
                setCreateChat(true);
                handleGetTagsAndDocumentsFromChroma(toast, context);
              }}
              listItems={titles}
              onClickListItem={(index: number) => {
                handleRetrieveConvoHistory(toast, context, titles[index].id);
                setActiveTitleId(titles[index].id);
              }}
              getListItemContents={(item: TitleInfo) => {
                return item.title;
              }}
              getListItemStyle={(item: TitleInfo) => {
                return activeTitleId === item.id ? "selected-conversation-title" : "default-conversation-title";
              }}
              toggleMenu={handleToggleMenu}
            />
          </nav>

          {/* Main Task Contents */}
          <LLMPrimaryContents toast={toast} />
        </div>
        {activeMenu && <div style={{ position: "absolute", left: "23rem", top: anchor.y }}>MEOW MEOW</div>}
        {/* Create New Chat Page */}
        {createChat && <CreateChatView toast={toast} />}
      </div>
    </>
  );
};

export default LLMDashboardView;
