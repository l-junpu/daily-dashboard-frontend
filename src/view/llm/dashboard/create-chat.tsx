import React from "react";
import "./create-chat.css";

import { LLMDashboardContext } from "../../../context/llm-dashboard/context";
import RemovableButton from "../../../base-component/removable-button/removable-button";
import { handleCreateChatApi } from "../../../api/llm-dashboard-api";

interface CreateChatViewProps {
  toast: any;
}

export const CreateChatView = ({ toast }: CreateChatViewProps) => {
  const context = React.useContext(LLMDashboardContext);
  if (!context) {
    toast.error("Unable to retrieve LLM Dashboar Context");
    return;
  }
  const { newTitle, setNewTitle, tags, selectedTags, docs, selectedDocs, setCreateChat } = context;

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
        <h4>Add Document Tags</h4>
        <div className="tag-control">
          <select className="dropdown-box">
            {tags.map((tag, index) => (
              <option key={index}>{tag}</option>
            ))}
          </select>
          <button className="action-button">✚ Add Tag</button>
        </div>
        <div className="tag-display">
          {selectedTags.map((tag, index) => (
            <RemovableButton idx={index} name={tag} removeItem={(x: string) => {}} />
          ))}
        </div>
        <h4>Add Documents</h4>
        <div className="tag-control">
          <select className="dropdown-box">
            {docs.map((tag, index) => (
              <option key={index}>{tag}</option>
            ))}
          </select>
          <button className="action-button">✚ Add Doc</button>
        </div>
        <div className="tag-display">
          {selectedDocs.map((tag, index) => (
            <RemovableButton idx={index} name={tag} removeItem={(x: string) => {}} />
          ))}
        </div>
        <div className="footer">
          <button
            type="submit"
            className={newTitle.length > 0 ? "action-button" : "action-button-inactive"}
            disabled={newTitle.length > 0 ? false : true}
          >
            Create Chat
          </button>
          <button
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
