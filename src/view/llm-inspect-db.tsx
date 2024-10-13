import "./llm-inspect-db.css";
import "react-toastify/dist/ReactToastify.css";

import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import FetchAPI from "../api/helper";
import IconButton from "../base-component/icon-button/icon-button";

// For Secondary Navbar
interface ButtonProps {
  text: string;
  onClick: () => void;
}

// For Database Fields
interface DatabaseValues {
  source: string;
  tag: string;
  user: string;
  date: string;
}

const LLMInspectDBView = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  const [searchTag, setSearchTag] = useState("");
  const [deleteTag, setDeleteTag] = useState(false);
  const [enableDeleteTagButton, setEnableDeleteTagButton] = useState(false);
  const [confirmTag, setConfirmTag] = useState("");
  const [allTags, setAllTags] = useState<string[] | null>([]);

  const [database, setDatabase] = useState<DatabaseValues[] | null>([
    { source: "VR-Link_5.7_Getting_Started_Guide.pdf", tag: "vr-link", user: "jp", date: "13-10-2024" },
    { source: "VR-Link_5.7_Getting_Started.pdf", tag: "tag 2", user: "jp", date: "13-10-2024" },
    { source: "VR-Link_5.7_Getting_Started.pdf", tag: "tag 2", user: "jp", date: "13-10-2024" },
    { source: "VR-Link_5.7_Getting_Started.pdf", tag: "tag 2", user: "jp", date: "13-10-2024" },
    { source: "VR-Link_5.7_Getting_Started.pdf", tag: "tag 2", user: "jp", date: "13-10-2024" },
    { source: "VR-Link_5.7_Getting_Started.pdf", tag: "tag 2", user: "jp", date: "13-10-2024" },
    { source: "VR-Link_5.7_Getting_Started.pdf", tag: "tag 2", user: "jp", date: "13-10-2024" },
    { source: "VR-Link_5.7_Getting_Started.pdf", tag: "tag 2", user: "jp", date: "13-10-2024" },
    { source: "VR-Link_5.7_Getting_Started.pdf", tag: "tag 2", user: "jp", date: "13-10-2024" },
    { source: "VR-Link_5.7_Getting_Started.pdf", tag: "tag 2", user: "jp", date: "13-10-2024" },
    { source: "VR-Link_5.7_Getting_Started.pdf", tag: "tag 2", user: "jp", date: "13-10-2024" },
    { source: "VR-Link_5.7_Getting_Started.pdf", tag: "tag 2", user: "jp", date: "13-10-2024" },
    { source: "VR-Link_5.7_Getting.pdf", tag: "tag 3", user: "jp", date: "13-10-2024" },
    { source: "VR-Link_5.7_Getting.pdf", tag: "tag 3", user: "jp", date: "13-10-2024" },
    { source: "VR-Link_5.7_Getting.pdf", tag: "tag 3", user: "jp", date: "13-10-2024" },
    { source: "VR-Link_5.7_Getting.pdf", tag: "tag 3", user: "jp", date: "13-10-2024" },
    { source: "VR-Link_5.7_Getting.pdf", tag: "tag 3", user: "jp", date: "13-10-2024" },
    { source: "VR-Link_5.7_Getting.pdf", tag: "tag 3", user: "jp", date: "13-10-2024" },
    { source: "VR-Link_5.7_Getting.pdf", tag: "tag 3", user: "jp", date: "13-10-2024" },
    { source: "VR-Link_5.7_Getting.pdf", tag: "tag 3", user: "jp", date: "13-10-2024" },
    { source: "VR-Link_5.7_Getting.pdf", tag: "tag 3", user: "jp", date: "13-10-2024" },
    { source: "VR-Link_5.7_Getting.pdf", tag: "tag 3", user: "jp", date: "13-10-2024" },
    { source: "VR-Link_5.7_Getting.pdf", tag: "tag 3", user: "jp", date: "13-10-2024" },
    { source: "VR-Link_5.7_Getting.pdf", tag: "tag 3", user: "jp", date: "13-10-2024" },
    { source: "VR-Link_5.7_Getting.pdf", tag: "tag 3", user: "jp", date: "13-10-2024" },
    { source: "VR-Link_5.7_Getting.pdf", tag: "tag 3", user: "jp", date: "13-10-2024" },
    { source: "VR-Link_5.7_Getting.pdf", tag: "tag 3", user: "jp", date: "13-10-2024" },
    { source: "VR-Link_5.7.pdf", tag: "tag 4", user: "jp", date: "13-10-2024" },
    { source: "VR-Link_5.7.pdf", tag: "tag 4", user: "jp", date: "13-10-2024" },
    { source: "VR-Link_5.7.pdf", tag: "tag 4", user: "jp", date: "13-10-2024" },
    { source: "VR-Link_5.7.pdf", tag: "tag 4", user: "jp", date: "13-10-2024" },
    { source: "VR-Link_5.7.pdf", tag: "tag 4", user: "jp", date: "13-10-2024" },
    { source: "VR-Link_5.7.pdf", tag: "tag 4", user: "jp", date: "13-10-2024" },
    { source: "VR-Link_5.7.pdf", tag: "tag 4", user: "jp", date: "13-10-2024" },
    { source: "VR-Link_5.7.pdf", tag: "tag 4", user: "jp", date: "13-10-2024" },
    { source: "VR-Link_5.7.pdf", tag: "tag 4", user: "jp", date: "13-10-2024" },
    { source: "VR-Link_5.7.pdf", tag: "tag 4", user: "jp", date: "13-10-2024" },
  ]);

  // Retrieve necessary information on initial mount
  useEffect(() => {
    const storedUsername = sessionStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  // Update addTags when database is updated
  useEffect(() => {
    if (!database) return;

    let tags: string[] = [];
    for (let row of database) {
      if (tags.find((tag) => tag === row.tag)) continue;
      tags.push(row.tag);
    }

    setAllTags([...tags]);
  }, [database]);

  // Update addTags when database is updated
  useEffect(() => {
    if (allTags?.find((tag) => tag === searchTag)) setEnableDeleteTagButton(true);
    else setEnableDeleteTagButton(false);
  }, [searchTag]);

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

  // Handle Delete Tag
  const handleDeleteTag = (e: React.FormEvent<HTMLFormElement>) => {};

  // Handle Cancel Delete
  const handleCancelDelete = () => {
    setConfirmTag("");
    setDeleteTag(false);
  };

  // Filter Our Database Rows If Searching For Specific Tags
  var filteredDatabase: DatabaseValues[] = [];
  if (database) {
    if (searchTag != "") {
      filteredDatabase = database.filter((row) => row.tag.includes(searchTag));
    } else {
      filteredDatabase = database;
    }
  }

  return (
    <div className="dashboard-container">
      <ToastContainer position="bottom-right" />
      {/* Dashboard Header */}
      <header className="dashboard-header">HEADER</header>
      <div className="dashboard-body">
        {/* Redirection to the 2 main applications */}
        <nav className="primary-navbar">
          <IconButton primaryText="📋" hoverText="Tasks" cssStyle="button" onClick={() => navigate("/dashboard/tasks", { replace: true })} />
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
            <input type="text" placeholder="Search Tag..." className="search" value={searchTag} onChange={(e) => setSearchTag(e.target.value)} />
            <button
              onClick={() => {
                setDeleteTag(true);
              }}
              className={enableDeleteTagButton ? "action-button" : "action-button-inactive"}
              disabled={!enableDeleteTagButton}
            >
              🗑️ Delete Tag
            </button>
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
              {filteredDatabase.map((row, index) => (
                <div className="row" key={index}>
                  <p className="overflow center">{index}</p>
                  <a className="overflow center">{row.source}</a>
                  <p className="overflow center">{row.tag}</p>
                  <p className="overflow center">{row.user}</p>
                  <p className="overflow center">{row.date}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Delete Tag Page */}
          {deleteTag && (
            <form
              className="delete-tag-container"
              onSubmit={(e) => {
                handleDeleteTag(e);
              }}
            >
              <div className="delete-tag-contents">
                <h2>Delete Tag</h2>
                <p style={{ marginTop: "8px" }}>To confirm, type "{searchTag}" in the box below</p>
                <input type="text" name="confirm-delete-tag" className="tag-name" value={confirmTag} onChange={(e) => setConfirmTag(e.target.value)} />
                <div className="footer">
                  <button type="submit" className={confirmTag === searchTag ? "action-button" : "action-button-inactive"} disabled={confirmTag !== searchTag}>
                    Delete Tag
                  </button>
                  <button onClick={() => handleCancelDelete()} className="action-button">
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
