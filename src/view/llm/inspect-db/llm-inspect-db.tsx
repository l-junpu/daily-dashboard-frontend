import "./llm-inspect-db.css";
import "react-toastify/dist/ReactToastify.css";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import IconButton from "../../../base-component/icon-button/icon-button";
import DropdownDisplay from "../../../base-component/dropdown-display/dropdown-display";
import { FetchRelevantDocuments, FetchTagsAndDocs } from "../../../api/llm-inspect-api";
import { DatabaseValues } from "../../../data/llm-data";
import RemovableButton from "../../../base-component/removable-button/removable-button";

import { RiDeleteBinLine } from "react-icons/ri";
import ConfirmMenu from "../../../base-component/confirm-menu/confirm-menu";
import DeleteTags from "./delete-tags";
import FilterTags from "./filter-tags";

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

  const [openDeleteTagPage, setOpenDeleteTagPage] = useState(false);

  const [tags, setTags] = useState<string[]>([]);
  const [users, setUsers] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const [openConfirmMenu, setOpenConfirmMenu] = useState(false);
  const [deleteDocumentName, setDeleteDocumentName] = useState("");

  const [database, setDatabase] = useState<DatabaseValues[] | null>([]);

  // Retrieve necessary information on initial mount
  useEffect(() => {
    const storedUsername = sessionStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }

    FetchTagsAndDocs(toast, setTags, setUsers);
    FetchRelevantDocuments(setDatabase, setMaxPageNumber, selectedTags, selectedUsers, pageNumber, 10);
  }, []);

  useEffect(() => {
    handleSearchDocuments(0);
  }, [selectedTags, selectedUsers]);

  const handleSearchDocuments = (page: number) => {
    event?.preventDefault();
    FetchRelevantDocuments(setDatabase, setMaxPageNumber, selectedTags, selectedUsers, page, 10);
    setPageNumber(page);
    setOpenFilterPage(false);
  };

  // Handling scrolling of the filter for tag-display
  const scrollContainer = document.getElementById("tags-scroll-container");
  scrollContainer?.addEventListener("wheel", handleScroll);
  function handleScroll(event: WheelEvent) {
    if (!scrollContainer) return;
    if (event.deltaY > 0) {
      scrollContainer.scrollLeft += 1;
    } else {
      scrollContainer.scrollLeft -= 1;
    }
    event.preventDefault();
  }

  // Facilitate removal of list item
  const RemoveListItem = (
    change: string,
    oldList: string[],
    setOldList: (oldList: string[]) => void,
    newList: string[],
    setNewList: (newList: string[]) => void
  ) => {
    console.log(newList);

    const idx = oldList.indexOf(change);
    if (idx != -1) {
      const dupe = [...oldList];
      dupe.splice(idx, 1);
      setOldList(dupe);

      setNewList([...newList.slice(0, 1), change, ...newList.slice(1)]);
    }
  };

  const handleRefreshDocuments = () => {
    FetchTagsAndDocs(toast, setTags, setUsers);
    FetchRelevantDocuments(setDatabase, setMaxPageNumber, selectedTags, selectedUsers, pageNumber, 10);
  };

  const handleDeleteDocument = async (event: React.FormEvent<HTMLFormElement> | null, documentSource: string) => {
    event?.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/database/api/delete-doc/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          document: documentSource,
        }),
      });
      if (response.ok) {
        toast.success(`Successfully deleted: ${documentSource}`);
        FetchTagsAndDocs(toast, setTags, setUsers);
        FetchRelevantDocuments(setDatabase, setMaxPageNumber, selectedTags, selectedUsers, pageNumber, 10);
      } else {
        setDatabase([]);
      }
    } catch (error) {
      console.log(error);
      return null;
    }

    setOpenConfirmMenu(false);
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
          <div className="dashboard-contents-header">
            <input className="search" placeholder="Search sources..."></input>
            <button className="action-button" onClick={() => setOpenFilterPage(true)}>
              🌪️ Filter
            </button>
            <button className="action-button-cancel left-align" onClick={() => setOpenDeleteTagPage(true)}>
              🗑️ Delete Tags
            </button>
          </div>
          {(selectedTags.length > 0 || selectedUsers.length > 0) && (
            <div id="tags-scroll-container" className="dashboard-contents-header horizontal-scroll">
              {selectedTags.map((tag, index) => (
                <RemovableButton
                  idx={index}
                  name={tag}
                  removeItem={() => RemoveListItem(tag, selectedTags, setSelectedTags, tags, setTags)}
                />
              ))}
              {selectedUsers.map((user, index) => (
                <RemovableButton
                  idx={index}
                  name={user}
                  removeItem={() => RemoveListItem(user, selectedUsers, setSelectedUsers, users, setUsers)}
                />
              ))}
            </div>
          )}
          <div className="db-table">
            <header className="db-header">
              <p className="overflow left-border center">Index</p>
              <p className="overflow left-border center">Source</p>
              <p className="overflow left-border center">Tag</p>
              <p className="overflow left-border center">Added By</p>
              <p className="overflow right-border center">Delete</p>
            </header>
            <div className="db-body">
              {database?.map((row, index) => (
                <div className="row" key={index}>
                  <p className="overflow center">{pageNumber * 10 + index + 1}</p>
                  <a className="overflow center">{row.source}</a>
                  <p className="overflow center">{row.tag}</p>
                  <p className="overflow center">{row.user}</p>
                  <div
                    className="emoji-button"
                    onClick={() => {
                      setOpenConfirmMenu(true);
                      setDeleteDocumentName(row.source);
                    }}
                  >
                    <RiDeleteBinLine />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="db-page-control">
            <button
              className={pageNumber === 0 ? "nav-button-disabled" : "nav-button"}
              disabled={pageNumber === 0 ? true : false}
              onClick={() => handleSearchDocuments(0)}
            >
              {"<<"}
            </button>
            <button
              className={pageNumber === 0 ? "nav-button-disabled" : "nav-button"}
              disabled={pageNumber === 0 ? true : false}
              onClick={() => handleSearchDocuments(pageNumber - 1)}
            >
              {"<"}
            </button>
            <span className="page-number">Pg. {pageNumber + 1}</span>
            <button
              className={pageNumber === maxPageNumber ? "nav-button-disabled" : "nav-button"}
              disabled={pageNumber === maxPageNumber ? true : false}
              onClick={() => handleSearchDocuments(pageNumber + 1)}
            >
              {">"}
            </button>
            <button
              className={pageNumber === maxPageNumber ? "nav-button-disabled" : "nav-button"}
              disabled={pageNumber === maxPageNumber ? true : false}
              onClick={() => handleSearchDocuments(maxPageNumber)}
            >
              {">>"}
            </button>
          </div>
          {/* Delete Tag Page */}
          {openFilterPage && (
            <FilterTags
              tags={tags}
              setTags={setTags}
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              users={users}
              setUsers={setUsers}
              selectedUsers={selectedUsers}
              setSelectedUsers={setSelectedUsers}
              setOpenFilterPage={setOpenFilterPage}
            />
          )}
          {openDeleteTagPage && (
            <DeleteTags
              toast={toast}
              tags={tags}
              handleRefreshDocuments={handleRefreshDocuments}
              setMenuOpenStatus={setOpenDeleteTagPage}
            />
          )}
          {openConfirmMenu && (
            <ConfirmMenu
              header="Confirm Deletion"
              setOpenConfirmMenu={setOpenConfirmMenu}
              handleConfirm={handleDeleteDocument}
              userString={username}
              documentString={deleteDocumentName}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default LLMInspectDBView;
