import { Virtuoso } from "react-virtuoso";

interface VirtualizedListProps {
    rowCount : number,
    rowComponent : React.FC<number>;
  }

const VirtualizedList = ({rowCount, rowComponent} : VirtualizedListProps) => {

    return (
        <Virtuoso 
        totalCount={rowCount}
        itemContent={index => rowComponent(index)}
        />
    );
};

export default VirtualizedList;