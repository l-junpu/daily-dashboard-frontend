import "./task-card.css";

// import "./task-card.css";

// import IconButton from "../icon-button/icon-button";

// export interface TaskCardProps {
//   taskId: number;
//   title: string;
//   description: string;
//   tags: string[];
//   status: boolean;
//   lastModified: string;
//   createdOn: string;
// }

// const TaskCard = ({ title, description, tags, status, lastModified, createdOn }: TaskCardProps) => {
//   return (
//     <div className="task-card">
//       {/* Title */}
//       <h3>{title}</h3>
//       {/* Description */}
//       <p className="description">{description}</p>
//       {/* User Tags */}
//       <div className="tags-container">
//         {tags.map((tag, index) => (
//           <span key={index} className="tag">
//             {tag}
//           </span>
//         ))}
//       </div>
//       <div className="date-container">
//         <p style={{ textAlign: "left", color: "gray" }}>Last Modified: {lastModified}</p>
//         <p style={{ textAlign: "left", color: "gray" }}>Created On: {createdOn}</p>
//       </div>
//       <footer className="footer">
//         <IconButton primaryText={status ? "✅ Completed" : "⚠️ In Progress"} onClick={() => {}} />
//         <IconButton primaryText="🖉" baseStyle="edit" onClick={() => {}} />
//         <IconButton primaryText="🗑" onClick={() => {}} />
//       </footer>
//     </div>
//   );
// };

const CreateTaskCard = () => {
  return (
    <div>
      <h3>Create a Title</h3>
      <h4>Title</h4>
      <input type="text" />
    </div>
  );
};

export default CreateTaskCard;
