import "./more-info.css";

import { LLMDashboardContextType } from "../../../context/llm-dashboard/context";
import { useEffect } from "react";
import { handleGetMoreInfo } from "../../../api/llm-dashboard-api";

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
        <h3>Selected Tags</h3>
        {/* Displaying Document Tags */}
        {selectedTags && selectedTags.length === 0 ? (
          <p style={{ marginBottom: "20px" }}>None</p>
        ) : (
          <div className="tag-display">
            {selectedTags.map((tag, index) => (
              <span className="button" key={index}>
                {tag}
              </span>
            ))}
          </div>
        )}

        <hr className="hr"></hr>

        <h3>Selected Docs</h3>
        {/* Displaying Document Tags */}
        {selectedDocs && selectedDocs.length === 0 ? (
          <p style={{ marginBottom: "20px" }}>None</p>
        ) : (
          <div className="tag-display">
            {selectedDocs.map((doc, index) => (
              <span className="button" key={index}>
                {doc}
              </span>
            ))}
          </div>
        )}

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
