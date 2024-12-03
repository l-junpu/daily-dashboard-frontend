import React, { useEffect } from "react";
import "./create-chat.css";

import { LLMDashboardContext } from "../../../context/llm-dashboard/context";
import { handleCreateChatApi } from "../../../api/llm-dashboard-api";
import { HttpStatusCode } from "axios";
import DropdownDisplay from "../../../base-component/dropdown-display/dropdown-display";

interface CreateChatViewProps {
  toast: any;
}

export const CreateChatView = ({ toast }: CreateChatViewProps) => {
  const context = React.useContext(LLMDashboardContext);
  if (!context) {
    toast.error("Unable to retrieve LLM Dashboar Context");
    return;
  }
  const {
    newTitle,
    setNewTitle,
    tags,
    setTags,
    selectedTags,
    setSelectedTags,
    docs,
    setDocs,
    selectedDocs,
    setSelectedDocs,
    createChat,
    setCreateChat,
  } = context;

  // Reset Tags & Docs on Reopen
  useEffect(() => {
    setSelectedTags([]);
    setSelectedDocs([]);
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
  }, [createChat]);

  return (
    <form
      className="create-chat-container"
      onSubmit={(e) => {
        handleCreateChatApi(e, toast, context);
      }}
    >
      <div className="new-chat-contents">
        <h2 style={{ color: "var(--color-font)" }}>Create New Chat</h2>
        <input
          type="text"
          placeholder="New Chat Name"
          name="title"
          className="chat-name"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />

        {/* Adding Document Tags */}
        <DropdownDisplay
          displayOnly={false}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          dropdownHeader="Add Document Tags"
          addDropdownButton="✚ Add Tag"
          tags={tags}
          setTags={setTags}
        />

        {/* Adding Documents */}
        <DropdownDisplay
          displayOnly={false}
          selectedTags={selectedDocs}
          setSelectedTags={setSelectedDocs}
          dropdownHeader="Add Documents"
          addDropdownButton="✚ Add Docs"
          tags={docs}
          setTags={setDocs}
        />

        <div className="footer">
          <button
            type="submit"
            className={newTitle.length > 0 ? "action-button" : "action-button-inactive"}
            disabled={newTitle.length > 0 ? false : true}
          >
            Create Chat
          </button>
          <button
            type="button"
            onClick={() => {
              setCreateChat(false);
              setNewTitle("");
            }}
            className="action-button-cancel"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
};
