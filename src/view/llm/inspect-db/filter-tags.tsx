import "./filter-tags.css";

import DropdownDisplay from "../../../base-component/dropdown-display/dropdown-display";
import { useState } from "react";

interface FilterTagsProps {
  tags: string[];
  setTags: (tags: string[]) => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  users: string[];
  setUsers: (tags: string[]) => void;
  selectedUsers: string[];
  setSelectedUsers: (tags: string[]) => void;
  setOpenFilterPage: (status: boolean) => void;
}

const FilterTags = ({
  tags,
  setTags,
  selectedTags,
  setSelectedTags,
  users,
  setUsers,
  selectedUsers,
  setSelectedUsers,
  setOpenFilterPage,
}: FilterTagsProps) => {
  const [localTags, setLocalTags] = useState<string[]>([...tags]);
  const [selectedLocalTags, setSelectedLocalTags] = useState<string[]>([...selectedTags]);
  const [localUsers, setLocalUsers] = useState<string[]>([...users]);
  const [selectedLocalUsers, setSelectedLocalUsers] = useState<string[]>([...selectedUsers]);

  const areListsEqual = (list1: string[], list2: string[]) => {
    return (
      list1.length === list2.length && list1.every((item) => list2.indexOf(item) > -1) && list2.every((item) => list1.indexOf(item) > -1)
    );
  };

  const sameTags = areListsEqual(selectedTags, selectedLocalTags);
  const sameUsers = areListsEqual(selectedUsers, selectedLocalUsers);

  return (
    <form
      className="filter-tag-container"
      onSubmit={(e) => {
        setTags([...localTags]);
        setSelectedTags([...selectedLocalTags]);
        setUsers([...localUsers]);
        setSelectedUsers([...selectedLocalUsers]);
        setOpenFilterPage(false);
      }}
    >
      <div className="filter-tag-contents">
        <h2>Filter Documents</h2>
        <DropdownDisplay
          displayOnly={false}
          selectedTags={selectedLocalTags}
          setSelectedTags={setSelectedLocalTags}
          dropdownHeader="Add Document Tags"
          addDropdownButton="✚ Add Tag"
          tags={localTags}
          setTags={setLocalTags}
        />
        <DropdownDisplay
          displayOnly={false}
          selectedTags={selectedLocalUsers}
          setSelectedTags={setSelectedLocalUsers}
          dropdownHeader="Add Users"
          addDropdownButton="✚ Add Users"
          tags={localUsers}
          setTags={setLocalUsers}
        />
        <div className="footer">
          {/* Footers - Only on click search then do we select  */}
          <button
            type="submit"
            className={sameTags && sameUsers ? "action-button-inactive" : "action-button"}
            disabled={sameTags && sameUsers}
          >
            Search
          </button>
          <button className="action-button-cancel" onClick={() => setOpenFilterPage(false)}>
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
};

export default FilterTags;
