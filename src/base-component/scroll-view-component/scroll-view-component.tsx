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
            <button key={index} className={getListItemStyle(listItems[index])} onClick={() => onClickListItem(index)}>
              <span className="button-text-wrap">{getListItemContents(listItems[index])}</span>
            </button>
          )}
        />
      </div>
    </>
  );
};
