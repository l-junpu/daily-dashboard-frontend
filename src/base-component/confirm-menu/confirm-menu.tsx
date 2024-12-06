import { useState } from "react";
import "./confirm-menu.css";

interface ConfirmMenuProps {
  header: string;
  setOpenConfirmMenu: (status: boolean) => void;
  handleConfirm: (event: React.FormEvent<HTMLFormElement> | null, identifier: any) => void;
  userString?: string;
  documentString?: string;
}

const ConfirmMenu = ({ header, setOpenConfirmMenu, handleConfirm, userString, documentString }: ConfirmMenuProps) => {
  const requiredString = userString + "/" + documentString;
  const [confirmation, setConfirmation] = useState("");

  return (
    <>
      <form className="confirm-container" onSubmit={(e) => handleConfirm(e, documentString)}>
        <div className="confirm-container-contents">
          <h2 style={{ color: "var(--color-font)" }}>{header}</h2>
          {documentString && userString ? (
            <>
              <div className="secondary-body">
                <span className="confirm-description">Type "{requiredString}" to proceed</span>
                <input
                  className="confirm-tag"
                  placeholder={requiredString}
                  value={confirmation}
                  onChange={(e) => setConfirmation(e.target.value)}
                ></input>
              </div>
              <div className="primary-body">
                <button
                  className={confirmation === requiredString ? "action-button" : "action-button-inactive"}
                  disabled={confirmation != requiredString}
                >
                  Confirm
                </button>
                <button type="button" className="action-button-cancel" onClick={() => setOpenConfirmMenu(false)}>
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <div className="primary-body">
              <button className="action-button">Confirm</button>
              <button type="button" className="action-button-cancel" onClick={() => setOpenConfirmMenu(false)}>
                Cancel
              </button>
            </div>
          )}
        </div>
      </form>
    </>
  );
};

export default ConfirmMenu;
