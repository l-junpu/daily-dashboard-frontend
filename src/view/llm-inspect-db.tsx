import "./llm-inspect-db.css";
import "react-toastify/dist/ReactToastify.css";

import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import IconButton from "../base-component/icon-button/icon-button";
import { HttpStatusCode } from "axios";
import RemovableButton from "../base-component/removable-button/removable-button";

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

  const [pageNumber, setPageNumber] = useState(0);
  const [openFilterPage, setOpenFilterPage] = useState(false);

  const [tags, setTags] = useState<string[]>([]);
  const [docs, setDocs] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [activeTag, setActiveTag] = useState("");
  const [activeDoc, setActiveDoc] = useState("");

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

  // Retrieve Tags & Documents
  useEffect(() => {
    const FetchTagsAndDocs = async () => {
      try {
        const response = await fetch("http://localhost:5000/database/api/retrieve-tags-and-docs/", {
          method: "GET",
        });
        if (!response.ok) {
          toast.error("Unable to retrieve Tags and Docs from Chroma DB");
          return;
        }

        const responseData = await response.json();
        if (response.status == HttpStatusCode.Ok) {
          setTags(["", ...responseData.tags]);
          setDocs(["", ...responseData.docs]);
        }
      } catch (error) {
        console.log(error);
      }
    };

    FetchTagsAndDocs();
  }, [openFilterPage]);

  // Function to handle Adding of Tags / Documents from "List"
  const handleAddRemoveTags = (
    change: string,
    setChange: (change: string) => void,
    oldList: string[],
    setOldList: (oldList: string[]) => void,
    newList: string[],
    setNewList: (newList: string[]) => void
  ) => {
    if (change == "") return;

    const index = oldList.indexOf(change);
    if (index != -1) {
      // Remove Element from Old List
      const changedList = [...oldList];
      changedList.splice(index, 1);
      setOldList(changedList);

      // Add Element to New List
      setNewList([...newList.slice(0, 1), change, ...newList.slice(1)]);

      // Reset Change
      setChange("");
    }
  };

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
                  <p className="overflow center">{index}</p>
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
            <form className="filter-tag-container" onSubmit={(e) => {}}>
              <div className="filter-tag-contents">
                <h2>Filter Documents</h2>
                {/* Adding Document Tags */}
                <h4 className="tag-header">Add Document Tags</h4>
                <div className="tag-control">
                  <select
                    className="dropdown-box"
                    onChange={(e) => {
                      setActiveTag(e.target.value);
                    }}
                    value={activeTag}
                  >
                    {tags.map((tag, index) => (
                      <option key={index}>{tag}</option>
                    ))}
                  </select>
                  <button
                    className="action-button"
                    type="button"
                    onClick={() => handleAddRemoveTags(activeTag, setActiveTag, tags, setTags, selectedTags, setSelectedTags)}
                  >
                    ✚ Add Tag
                  </button>
                </div>
                {/* Displaying Document Tags */}
                <div className="tag-display">
                  {selectedTags.map((tag, index) => (
                    <RemovableButton
                      idx={index}
                      name={tag}
                      removeItem={() => handleAddRemoveTags(tag, setActiveTag, selectedTags, setSelectedTags, tags, setTags)}
                    />
                  ))}
                </div>
                <div className="footer">
                  {/* Footers */}
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
