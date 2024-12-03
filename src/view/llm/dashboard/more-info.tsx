import "./more-info.css";

import { LLMDashboardContextType } from "../../../context/llm-dashboard/context";
import { useEffect } from "react";
import { handleGetMoreInfo } from "../../../api/llm-dashboard-api";
import DropdownDisplay from "../../../base-component/dropdown-display/dropdown-display";

interface MoreInfoProps {
  toast: any;
  context: LLMDashboardContextType;
}

const MoreInfo = ({ toast, context }: MoreInfoProps) => {
  const { selectedTags, selectedDocs, setShowMoreInfo } = context;

  useEffect(() => {
    const Intitialize = async () => {
      await handleGetMoreInfo(toast, context);
    };
    Intitialize();
  }, []);

  return (
    <div className="more-info-container">
      <div className="more-info-body">
        {/* Displaying Document Tags */}
        <DropdownDisplay displayOnly={true} selectedTags={selectedTags} selectedHeader="Selected Tags" />
        <hr className="hr"></hr>
        {/* Displaying Document Tags */}
        <DropdownDisplay displayOnly={true} selectedTags={selectedDocs} selectedHeader="Selected Docs" />
        <button
          style={{ width: "fit-content", alignSelf: "center" }}
          className="action-button-cancel"
          onClick={() => setShowMoreInfo(false)}
        >
          Return
        </button>
      </div>
    </div>
  );
};

export default MoreInfo;
