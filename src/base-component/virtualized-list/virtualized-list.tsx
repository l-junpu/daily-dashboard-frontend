import { useState } from "react";
import { Virtuoso } from "react-virtuoso";

interface VirtualizedListProps {
  rowCount: number;
  rowComponent: React.FC<number>;
  isConversationPage?: boolean;
}

const VirtualizedList = ({ rowCount, rowComponent, isConversationPage = false }: VirtualizedListProps) => {
  const [isAtBottom, setIsAtBottom] = useState(true);

  return isConversationPage ? (
    <Virtuoso
      followOutput={isAtBottom}
      initialTopMostItemIndex={rowCount - 1}
      atBottomStateChange={(atBottom) => {
        setIsAtBottom(atBottom);
      }}
      totalCount={rowCount}
      itemContent={(index) => rowComponent(index)}
    />
  ) : (
    <Virtuoso totalCount={rowCount} itemContent={(index) => rowComponent(index)} />
  );
};

export default VirtualizedList;
