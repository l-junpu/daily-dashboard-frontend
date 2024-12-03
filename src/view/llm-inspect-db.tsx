import "./llm-inspect-db.css";
import "react-toastify/dist/ReactToastify.css";

import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import IconButton from "../base-component/icon-button/icon-button";
import DropdownDisplay from "../base-component/dropdown-display/dropdown-display";
import { FetchRelevantDocuments, FetchTagsAndDocs } from "../api/llm-inspect-api";
import { DatabaseValues } from "../data/llm-data";

// For Secondary Navbar
interface ButtonProps {
  text: string;
  onClick: () => void;
}

const LLMInspectDBView = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  const [pageNumber, setPageNumber] = useState(0);
  const [maxPageNumber, setMaxPageNumber] = useState(0);
  const [openFilterPage, setOpenFilterPage] = useState(false);

  const [tags, setTags] = useState<string[]>([]);
  const [users, setUsers] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const [database, setDatabase] = useState<DatabaseValues[] | null>([]);

  const handleSearchDocuments = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    FetchRelevantDocuments(setDatabase, setMaxPageNumber, selectedTags, selectedUsers, pageNumber, 10);
    setOpenFilterPage(false);
  };

  // Retrieve necessary information on initial mount
  useEffect(() => {
    const storedUsername = sessionStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }

    FetchTagsAndDocs(toast, setTags, setUsers);
    FetchRelevantDocuments(setDatabase, setMaxPageNumber, selectedTags, selectedUsers, pageNumber, 10);
  }, []);

  // Active Buttons
  const secondaryButtonProps: ButtonProps[] = [
    {
      text: "📋 Conversations",
      onClick: () => {
        navigate("/dashboard/llm/conversations", { replace: true });
      },
    },
    { text: "🔍 View Embeddings", onClick: () => {} },
    {
      text: "⚙️ Add Embeddings",
      onClick: () => {
        navigate("/dashboard/llm/upload-docs", { replace: true });
      },
    },
  ];
  const [selectedSecondaryButton, setSelectedSecondaryButton] = useState(1); // Just Highlight 🔍 View Embeddings

  return (
    <div className="dashboard-container">
      <ToastContainer position="bottom-right" />
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

        {/* Redirections to the different Task pages */}
        <div className="secondary-navbar">
          <p className="prefix">DASHBOARD</p>
          <nav>
            {secondaryButtonProps.map((button, index) => (
              <button key={index} className={selectedSecondaryButton === index ? "selected-button" : "button"} onClick={button.onClick}>
                {button.text}
              </button>
            ))}
          </nav>
        </div>
        {/* Main File Upload Contents */}
        <main className="inspect-dashboard-contents">
          <div className="tag-actions">
            <button className="action-button" onClick={() => setOpenFilterPage(true)}>
              🌪️ Filter
            </button>
            <button className="action-button-cancel">🗑️ Clear</button>
          </div>
          <div className="db-table">
            <header className="db-header">
              <p className="overflow left-border center">Index</p>
              <p className="overflow left-border center">Source</p>
              <p className="overflow left-border center">Tag</p>
              <p className="overflow left-border center">Added By</p>
              <p className="overflow right-border center">Date Added</p>
            </header>
            <div className="db-body">
              {database?.map((row, index) => (
                <div className="row" key={index}>
                  <p className="overflow center">{index + 1}</p>
                  <a className="overflow center">{row.source}</a>
                  <p className="overflow center">{row.tag}</p>
                  <p className="overflow center">{row.user}</p>
                  <p className="overflow center">{row.date}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="db-page-control">
            <button className="nav-button">{"<<"}</button>
            <button className="nav-button">{"<"}</button>
            <span className="page-number">Pg. {pageNumber}</span>
            <button className="nav-button">{">"}</button>
            <button className="nav-button">{">>"}</button>
          </div>
          {/* Delete Tag Page */}
          {openFilterPage && (
            <form
              className="filter-tag-container"
              onSubmit={(e) => {
                handleSearchDocuments(e);
              }}
            >
              <div className="filter-tag-contents">
                <h2>Filter Documents</h2>
                <DropdownDisplay
                  displayOnly={false}
                  selectedTags={selectedTags}
                  setSelectedTags={setSelectedTags}
                  dropdownHeader="Add Document Tags"
                  addDropdownButton="✚ Add Tag"
                  tags={tags}
                  setTags={setTags}
                />
                <DropdownDisplay
                  displayOnly={false}
                  selectedTags={selectedUsers}
                  setSelectedTags={setSelectedUsers}
                  dropdownHeader="Add Users"
                  addDropdownButton="✚ Add Users"
                  tags={users}
                  setTags={setUsers}
                />
                <div className="footer">
                  {/* Footers - Only on click search then do we select  */}
                  <button type="submit" className="action-button">
                    Search
                  </button>
                  <button className="action-button-cancel" onClick={() => setOpenFilterPage(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          )}
        </main>
      </div>
    </div>
  );
};

export default LLMInspectDBView;
