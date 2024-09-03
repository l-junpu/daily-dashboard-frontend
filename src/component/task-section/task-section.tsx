/*
Represent different stages of a task (e.g., "To-Do", "In Progress", "Done")
Each column should display the tasks assigned to it
Users can:
- Assign tasks to a certain section
- Potentially create new sections
*/
import "./task-section.css";

import TextBox from "../../base-component/text-box/text-box";
import LabelButton from "../../base-component/label-button/label-button";
import ScrollList from "../../base-component/scroll-list/scroll-list";

interface TaskSectionProps {
  day: string;
}

const TaskSection = ({ day }: TaskSectionProps) => {
  let tasks: string[] = [
    "Updated the asddasd",
    "Updated the asddasd",
    "Updated the asddasd",
    "Updated the asddasd",
    "Updated the asddasd",
    "Updated the asddasd",
    "Updated the asddasd",
    "Updated the asddasd",
    "Updated the asddasd",
    "Updated the asddasd",
    "Updated the asddasd",
    "Updated the asddasd",
    "Updated the asddasd",
    "Updated the asddasd",
    "Updated the asddasd",
    "Updated the asddasd",
    "Updated the asddasd",
    "Updated the asddasd",
    "Updated the asddasd",
    "Updated the asddasd",
    "Updated the asddasd",
  ];

  const printString = (x: string, y: string) => {
    console.log("Clicked");
  };

  return (
    <div className="task-container">
      <div className="task-container-title">{day}</div>
      <div className="task-container-search">
        <TextBox placeholder="Search..." cssProps="task-container-search-bar" />
        <LabelButton name="Q" cssProps="task-container-search-button" />
      </div>
      <div className="task-container-body">
        <ScrollList values={tasks} enableMenu={true} onMenuButtonClick={printString} />
      </div>
    </div>
  );
};

export default TaskSection;
