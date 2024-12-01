import "./scroll-view-component.css";

import VirtualizedList from "../virtualized-list/virtualized-list";

interface ScrollViewComponentProps {
  header: string;
  defaultActionButton: boolean;
  defaultActionButtonName: string;
  onClickDefaultActionButton?: () => void;
  listItems: any[];
  onClickListItem: (index: number) => void;
  getListItemContents: (listItem: any) => string;
  getListItemStyle: (listItem: any) => string;
  toggleMenu: (pos: React.MouseEvent, listItem: any) => void;
}

export const ScrollViewComponent = ({
  header,
  defaultActionButton = false,
  defaultActionButtonName,
  onClickDefaultActionButton,
  listItems,
  onClickListItem,
  getListItemContents,
  getListItemStyle,
  toggleMenu,
}: ScrollViewComponentProps) => {
  return (
    <>
      <p style={{ borderTop: "1px solid rgb(0,0,0,0.2)" }} className="prefix">
        {header}
      </p>
      {defaultActionButton && (
        <button className="selected-button" onClick={onClickDefaultActionButton}>
          {defaultActionButtonName}
        </button>
      )}

      <div className="chat-history">
        <VirtualizedList
          rowCount={listItems.length}
          rowComponent={(index) => (
            <div className={getListItemStyle(listItems[index])}>
              <button key={index} className="primary-button-text" onClick={() => onClickListItem(index)}>
                <span className="button-text-wrap">{getListItemContents(listItems[index])}</span>
              </button>
              <button className="secondary-button-text" onClick={(e) => toggleMenu(e, listItems[index])}>
                ☰
              </button>
            </div>
          )}
        />
      </div>
    </>
  );
};
