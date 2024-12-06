import "./delete-tags.css";

import { useState } from "react";
import RemovableButton from "../../../base-component/removable-button/removable-button";
import { HttpStatusCode } from "axios";

interface DeleteTagsProps {
  toast: any;
  tags: string[];
  handleRefreshDocuments: () => void;
  setMenuOpenStatus: (status: boolean) => void;
}

const DeleteTags = ({ toast, tags, handleRefreshDocuments, setMenuOpenStatus }: DeleteTagsProps) => {
  const [tagsCopy, setTagsCopy] = useState<string[]>([...tags]);
  const [activeTag, setActiveTag] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

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

  const handleDeleteTagsApi = async () => {
    const response = await fetch("http://localhost:5000/database/api/delete-tags/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tags: selectedTags,
      }),
    });

    if (response.ok) {
      switch (response.status) {
        case HttpStatusCode.Ok: {
          toast.success("Successfully deleted tags");
          handleRefreshDocuments();
          setMenuOpenStatus(false);
        }
      }
    } else {
      toast.error("Unable to delete tags");
    }
  };

  return (
    <div className="delete-tags-container">
      <div className="delete-tags-body">
        <h2 style={{ marginBottom: "10px" }}>Select Tags to Delete</h2>
        <div className="tag-control">
          <select
            className="dropdown-box"
            onChange={(e) => {
              setActiveTag(e.target.value);
            }}
            value={activeTag}
          >
            {tagsCopy.map((tag, index) => (
              <option key={index}>{tag}</option>
            ))}
          </select>
          <button
            className="action-button"
            type="button"
            onClick={() => handleAddRemoveTags(activeTag, setActiveTag, tagsCopy, setTagsCopy, selectedTags, setSelectedTags)}
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
              removeItem={() => handleAddRemoveTags(tag, setActiveTag, selectedTags, setSelectedTags, tagsCopy, setTagsCopy)}
            />
          ))}
        </div>
        <div className="footer-control">
          <button
            className={selectedTags.length > 0 ? "action-button" : "action-button-inactive"}
            disabled={selectedTags.length > 0 ? false : true}
            onClick={() => handleDeleteTagsApi()}
          >
            Submit
          </button>
          <button className="action-button-cancel" onClick={() => setMenuOpenStatus(false)}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTags;
