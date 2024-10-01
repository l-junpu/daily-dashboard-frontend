import "./user-dashboard.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import IconButton from "../base-component/icon-button/icon-button";
import TaskCard, { TaskCardProps } from "../base-component/task-card/task-card";
import CreateTaskCard from "../base-component/create-task/create-task";

const UserDashboardView = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState<string | null>(null);

  const [createTask, setCreateTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskTags, setNewTaskTags] = useState<string[]>([]);
  const [newTaskStatus, setNewTaskStatus] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [completionStatus, setCompletionStatus] = useState<boolean | null>(null);

  // Retrieve necessary information on initial mount
  useEffect(() => {
    const storedUsername = sessionStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  // Retrieve tasks on username update
  useEffect(() => {
    if (username) {
      console.log("Username retrieved: ", username);
      // grab all the tasks here
    }
  }, [username]);

  // Sample description - For testing
  const [tasks, setTasks] = useState<TaskCardProps[]>([
    {
      taskId: 1,
      title: "Task 1",
      description: "Description for Task 1",
      tags: ["tag", "tag"],
      status: true,
      lastModified: "start",
      createdOn: "end",
    },
    { taskId: 2, title: "Task 2", description: "Description for Task 2", tags: ["tag"], status: true, lastModified: "start", createdOn: "end" },
    { taskId: 3, title: "Task 3", description: "Description for Task 3", tags: ["tag"], status: false, lastModified: "start", createdOn: "end" },
    { taskId: 4, title: "Task 4", description: "Description for Task 4", tags: ["tag"], status: false, lastModified: "start", createdOn: "end" },
    { taskId: 5, title: "Task 5", description: "Description for Task 5", tags: ["tag"], status: false, lastModified: "start", createdOn: "end" },
  ]);

  // Perform sorting of tasks based on Status
  const filteredStatusTasks = tasks.filter((task) => completionStatus == null || completionStatus == task.status);
  const filteredSearchTasks = filteredStatusTasks.filter(
    (task) => task.title.toLowerCase().includes(searchText.toLowerCase()) || task.description.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      {/* Dashboard Header */}
      <header className="dashboard-header">HEADER</header>
      <div className="dashboard-body">
        {/* Redirection to the 2 main applications */}
        <nav className="primary-navbar">
          <IconButton primaryText="📋" hoverText="Tasks" cssStyle="button" onClick={() => {}} />
          <IconButton primaryText="💻" hoverText="LLM" cssStyle="button" onClick={() => {}} />
        </nav>

        {/* Redirections to the different Task pages */}
        <div className="secondary-navbar">
          <IconButton primaryText="📋 All Tasks" cssStyle="button" onClick={() => setCompletionStatus(null)} />
          <IconButton primaryText="⚠️ In Progress" cssStyle="button" onClick={() => setCompletionStatus(false)} />
          <IconButton primaryText="✅ Completed" cssStyle="button" onClick={() => setCompletionStatus(true)} />
          <IconButton primaryText="⚙️ User Analytics" cssStyle="button" onClick={() => {}} />
        </div>

        {/* Main Task Contents */}
        <main className="dashboard-contents">
          {/* Main Task Header */}
          <div className="header">
            <input type="text" placeholder="Search tasks..." value={searchText} className="search-bar" onChange={(e) => setSearchText(e.target.value)} />
            <IconButton primaryText="╋" hoverText="Add Task" cssStyle="add-button" hoverCssStyle="add-button-hover" onClick={() => setCreateTask(true)} />
          </div>
          {/* Change This Header Accordingly */}
          <h2 style={{ textAlign: "left", margin: "0.5rem", textDecoration: "underline", fontSize: "30px" }}>All Tasks</h2>
          {/* Main Task Cards */}
          <div className="task-grid">
            {filteredSearchTasks.map((task) => (
              <TaskCard key={task.taskId} {...task} />
            ))}
          </div>
        </main>
      </div>
      {/* Create New Task Page */}
      {createTask && (
        <div className="create-task-container">
          <div className="new-task-contents">
            <h3 className="title">Create New Task</h3>
            <h4>Title</h4>
            <input type="text" placeholder="Task Title" className="title" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} />
            <h4>Description</h4>
            <input
              type="text"
              placeholder="Task Description"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              className="description"
            />
            <h4>Tags</h4>
            <div className="tags">
              <div className="container">
                {newTaskTags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="Task Description"
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                className="add"
              />
              <button onClick={() => {}}>Add Tag</button>
            </div>
            <div className="footer">
              <button onClick={() => setCreateTask(false)} className="create-button">
                Create Task
              </button>
              <button onClick={() => setCreateTask(false)} className="cancel-button">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboardView;
