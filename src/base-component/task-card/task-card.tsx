import "./task-card.css";

import IconButton from "../icon-button/icon-button";

// Used to store Task from Database
export interface TaskDetails {
  taskId: number;
  title: string;
  contents: string;
  status: boolean;
  lastModified: string;
  createdOn: string;
}

// TaskCard Props
export interface TaskCardProps {
  taskId: number;
  title: string;
  contents: string;
  status: boolean;
  lastModified: string;
  createdOn: string;
  onEdit: (taskId: number, newTitle: string, newContents: string, newStatus: boolean) => void;
  onOpenEdit: (taskId: number, title: string, contents: string, status: boolean) => void;
  onDelete: (taskId: number) => void;
}

const ConvertDateTime = (dt: string) => {
  const date = new Date(dt);
  const gmt8Date = new Date(date.getTime());

  const hours = gmt8Date.getHours();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  const formattedDate = `${formattedHours.toString().padStart(2, "0")}:${gmt8Date.getMinutes().toString().padStart(2, "0")} ${ampm} ${gmt8Date
    .getDate()
    .toString()
    .padStart(2, "0")}/${(gmt8Date.getMonth() + 1).toString().padStart(2, "0")}/${gmt8Date.getFullYear().toString().slice(2)}`;

  return formattedDate;
};

const TaskCard = ({ taskId, title, contents, status, lastModified, createdOn, onEdit, onOpenEdit, onDelete }: TaskCardProps) => {
  return (
    <div className="task-card">
      {/* Title */}
      <h3>{title}</h3>
      {/* contents */}
      <p className="contents">{contents}</p>
      <div className="date-container">
        <p style={{ textAlign: "left", color: "gray", fontWeight: "500" }}>Last Modified:</p>
        <p style={{ textAlign: "left", color: "gray" }}>{ConvertDateTime(lastModified)}</p>
        <p style={{ textAlign: "left", color: "gray", fontWeight: "500" }}>Created On:</p>
        <p style={{ textAlign: "left", color: "gray" }}>{ConvertDateTime(createdOn)}</p>
      </div>
      <footer className="footer">
        <IconButton
          primaryText={status ? "✅ Completed" : "⚠️ In Progress"}
          cssStyle="action-button"
          onClick={() => {
            onEdit(taskId, title, contents, !status);
          }}
        />
        <IconButton primaryText="📝" cssStyle="action-button" baseStyle="edit" onClick={() => onOpenEdit(taskId, title, contents, status)} />
        <IconButton
          primaryText="🗑️"
          cssStyle="action-button"
          onClick={() => {
            onDelete(taskId);
          }}
        />
      </footer>
    </div>
  );
};

export default TaskCard;
