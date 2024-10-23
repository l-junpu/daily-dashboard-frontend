import { useRef } from "react";

import { List, AutoSizer, CellMeasurer, CellMeasurerCache } from 'react-virtualized';

interface VirtualizedListProps {
    rowCount : number,
    rowComponent : React.FC<{index: number, style: React.CSSProperties}>;
  }

const VirtualizedList = ({rowCount, rowComponent} : VirtualizedListProps) => {
    const itemCache = useRef(new CellMeasurerCache({
        fixedHeight: true,
        defaultHeight: 50
      }))

    return (
        <AutoSizer>
              {({height, width}) => (
                <List
                height={height}
                width={width}
                rowHeight={itemCache.current.rowHeight}
                deferredMeasurementCache={itemCache.current}
                rowCount={rowCount}
                rowRenderer={(
                  { key, index, parent }) => (
                    <CellMeasurer 
                    key={key} 
                    cache={itemCache.current}
                    parent={parent}
                    columnIndex={0}
                    rowIndex={index}
                    >
                    <div></div>
                    </CellMeasurer>
                )}
              />
              )}
            </AutoSizer>
    );
};

export default VirtualizedList;