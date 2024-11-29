import React, { useEffect, useState } from "react";
import "./create-chat.css";

import { LLMDashboardContext } from "../../../context/llm-dashboard/context";
import RemovableButton from "../../../base-component/removable-button/removable-button";
import { handleCreateChatApi } from "../../../api/llm-dashboard-api";
import { HttpStatusCode } from "axios";

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

  // Variables used for the Dropdown Component
  const [activeTag, setActiveTag] = useState("");
  const [activeDoc, setActiveDoc] = useState("");

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
        <h4>Add Document Tags</h4>
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

        {/* Adding Documents */}
        <h4>Add Documents</h4>
        <div className="tag-control">
          <select
            className="dropdown-box"
            onChange={(e) => {
              setActiveDoc(e.target.value);
            }}
            value={activeDoc}
          >
            {docs.map((tag, index) => (
              <option key={index}>{tag}</option>
            ))}
          </select>
          <button
            className="action-button"
            type="button"
            onClick={() => handleAddRemoveTags(activeDoc, setActiveDoc, docs, setDocs, selectedDocs, setSelectedDocs)}
          >
            ✚ Add Doc
          </button>
        </div>

        {/* Displaying Documents */}
        <div className="tag-display">
          {selectedDocs.map((tag, index) => (
            <RemovableButton
              idx={index}
              name={tag}
              removeItem={() => handleAddRemoveTags(tag, setActiveDoc, selectedDocs, setSelectedDocs, docs, setDocs)}
            />
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
