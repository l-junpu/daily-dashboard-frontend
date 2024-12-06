import "./dropdown-display.css";

import RemovableButton from "../removable-button/removable-button";
import { useState } from "react";

interface DropdownDisplayProps {
  displayOnly: boolean;
  selectedTags: string[];
  setSelectedTags?: (selectedTags: string[]) => void;
  dropdownHeader?: string;
  addDropdownButton?: string;
  selectedHeader?: string;
  tags?: string[];
  setTags?: (tags: string[]) => void;
}

const DropdownDisplay = ({
  displayOnly,
  selectedTags,
  setSelectedTags,
  dropdownHeader,
  addDropdownButton,
  selectedHeader,
  tags,
  setTags,
}: DropdownDisplayProps) => {
  const [activeTag, setActiveTag] = useState("");

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

  // Display both dropdown and tag display
  if (!displayOnly && tags && setTags && setSelectedTags && dropdownHeader && addDropdownButton) {
    return (
      <>
        <h4 className="tag-header">{dropdownHeader}</h4>
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
            {addDropdownButton}
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
      </>
    );
  }
  // Display only tag display
  else {
    return (
      <>
        {/* Displaying Document Tags */}
        <h3 className="tag-header">{selectedHeader}</h3>
        {selectedTags && selectedTags.length === 0 ? (
          <p style={{ marginBottom: "20px" }}>None</p>
        ) : (
          <div className="tag-display">
            {selectedTags.map((tag, index) => (
              <span className="tag-text" key={index}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </>
    );
  }
};

export default DropdownDisplay;
