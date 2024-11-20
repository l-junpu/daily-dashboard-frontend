import "./user-dashboard.css";
import "react-toastify/dist/ReactToastify.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import IconButton from "../base-component/icon-button/icon-button";
import TaskCard, { TaskDetails } from "../base-component/task-card/task-card";
import { FetchResponse, HttpStatusCode } from "../api/helper";
import { toast, ToastContainer } from "react-toastify";

import { connectSocket } from "../api/socket";

interface ButtonProps {
  text: string;
  onClick: (index: number) => void;
}

const UserDashboardView = () => {
  const navigate = useNavigate();

  // Username
  const [username, setUsername] = useState<string | null>(null);

  // Highlight for selected secondary button
  const [header, setHeader] = useState<string>("📋 All Tasks");
  const [selectedSecondaryButton, setSelectedSecondaryButton] = useState<number>(0);

  // Create Task
  const [createTask, setCreateTask] = useState(false);
  const [modifyTask, setModifyTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskId, setNewTaskId] = useState(-1); // Temporary Variables - For Edit
  const [newTaskStatus, setNewTaskStatus] = useState(false); // Temporary Variables - For Edit
  const [newTaskContents, setNewTaskContents] = useState("");
  const [enableTaskAction, setEnableTaskAction] = useState(false);

  // Query
  const [searchText, setSearchText] = useState("");
  const [completionStatus, setCompletionStatus] = useState<boolean | null>(null);

  // Task Data for Username
  const [tasks, setTasks] = useState<TaskDetails[]>([]);
  // Perform sorting of tasks based on Status
  const filteredStatusTasks = tasks.filter((task) => completionStatus == null || completionStatus == task.status);
  const filteredSearchTasks = filteredStatusTasks.filter(
    (task) => task.title.toLowerCase().includes(searchText.toLowerCase()) || task.contents.toLowerCase().includes(searchText.toLowerCase())
  );

  // Handle Secondary Button Rendering
  const updateSecondaryButton = (index: number, completionState: any, header: string) => {
    setSelectedSecondaryButton(index);
    setCompletionStatus(completionState);
    setHeader(header);
  };
  const secondaryButtonProps: ButtonProps[] = [
    { text: "📋 All Tasks", onClick: (index: number) => updateSecondaryButton(index, null, "📋 All Tasks") },
    { text: "⚠️ In Progress", onClick: (index: number) => updateSecondaryButton(index, false, "⚠️ In Progress") },
    { text: "✅ Completed", onClick: (index: number) => updateSecondaryButton(index, true, "✅ Completed") },
    { text: "⚙️ User Analytics", onClick: (index: number) => {} },
  ];

  // Retrieve necessary information on initial mount
  useEffect(() => {
    const storedUsername = sessionStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
      connectSocket(storedUsername);
    }
  }, []);

  // Retrieve Tasks on Username Update
  useEffect(() => {
    const getTasksFromUser = async () => {
      if (username) {
        try {
          const response = await FetchResponse("http://localhost:8080/get_tasks_from_user", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: username,
            }),
          });

          if (response == null) {
            toast.error("Unable to connect to server");
            return;
          } else {
            switch (response.status) {
              case HttpStatusCode.OK:
                const responseJson = await response.json();
                if (responseJson.tasks && responseJson.tasks.length > 0) {
                  setTasks([...responseJson.tasks]);
                }
                break;
              default:
                toast.error(`Server side error: ${response.status}`);
                return;
            }
          }
        } catch (error) {
          console.error(error);
        }
      }
    };

    getTasksFromUser();
  }, [username]);

  useEffect(() => {
    if (newTaskTitle.length === 0 || newTaskContents.length === 0) setEnableTaskAction(false);
    else setEnableTaskAction(true);
  }, [newTaskTitle, newTaskContents]);

  // Handle Creation of Task
  const handleCreateTask = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Access Form Data
    const formData = new FormData(event.target as HTMLFormElement);
    // Get Post Data
    const title: string = formData.get("title") as string;
    const contents: string = formData.get("contents") as string;

    try {
      const response = await FetchResponse("http://localhost:8080/add_task_to_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          title: title,
          contents: contents,
        }),
      });

      if (response == null) {
        toast.error("Unable to connect to server");
        return;
      } else {
        switch (response.status) {
          case HttpStatusCode.OK:
            const responseJson = await response.json();
            // Append New Task at [0]
            const newTask = {
              taskId: responseJson.taskId,
              title: title,
              contents: contents,
              status: false,
              lastModified: responseJson.lastModified,
              createdOn: responseJson.createdOn,
            };
            setTasks([newTask, ...tasks]);
            toast.success("Created a new task");
            break;
          default:
            toast.error(`Server side error: ${response.status}`);
            return;
        }
      }
    } catch (error) {
      console.error(error);
    }

    // Reset
    setCreateTask(false);
    setNewTaskTitle("");
    setNewTaskContents("");
  };

  const handleEditTaskEvent = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await handleEditTask(newTaskId, newTaskTitle, newTaskContents, newTaskStatus);

    // Reset Values
    setNewTaskId(-1);
    setNewTaskTitle("");
    setNewTaskContents("contents");
    setNewTaskStatus(false);

    // Close Update Task Window - Inside of the Create New Task Tab
    setModifyTask(false);
  };

  const handleOpenEdit = (taskId: number, title: string, contents: string, status: boolean) => {
    setNewTaskId(taskId);
    setNewTaskTitle(title);
    setNewTaskContents(contents);
    setNewTaskStatus(status);

    // Open Update Task Window - Inside of the Create New Task Tab
    setModifyTask(true);
  };

  const handleEditTask = async (taskId: number, newTitle: string, newContents: string, newStatus: boolean) => {
    try {
      const response = await FetchResponse("http://localhost:8080/update_task_for_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskId: taskId,
          title: newTitle,
          contents: newContents,
          status: newStatus,
        }),
      });

      if (response == null) {
        toast.error("Unable to connect to server");
        return;
      } else {
        switch (response.status) {
          case HttpStatusCode.OK:
            const responseJson = await response.json();
            // Find the task with taskId and update its contents
            const updatedTasks = tasks.map((task) => {
              if (task.taskId === taskId) {
                return { ...task, title: newTitle, contents: newContents, status: newStatus, lastModified: responseJson.lastModified };
              }
              return task;
            });
            setTasks(updatedTasks);
            toast.success("Updated a task");
            break;
          default:
            toast.error(`Server side error: ${response.status}`);
            return;
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      const response = await FetchResponse("http://localhost:8080/remove_task_from_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          task_id: taskId,
        }),
      });

      if (response == null) {
        toast.error("Unable to connect to server");
        return;
      } else {
        switch (response.status) {
          case HttpStatusCode.OK:
            // Find the task with taskId and remove from Frontend
            const index = tasks.findIndex((task) => task.taskId === taskId);
            if (index !== -1) {
              setTasks([...tasks.slice(0, index), ...tasks.slice(index + 1)]);
            }
            toast.success("Removed a task");
            break;
          default:
            toast.error(`Server side error: ${response.status}`);
            return;
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <ToastContainer position="bottom-right" />
      <div className="dashboard-container">
        {/* Dashboard Header */}
        <header className="dashboard-header">HEADER</header>
        <div className="dashboard-body">
          {/* Redirection to the 2 main applications */}
          <nav className="primary-navbar">
            <IconButton primaryText="📋" hoverText="Tasks" cssStyle="button primary-selected" onClick={() => {}} />
            <IconButton
              primaryText="💻"
              hoverText="LLM"
              cssStyle="button"
              onClick={() => {
                navigate("/dashboard/llm/conversations", { replace: true });
              }}
            />
          </nav>

          {/* Redirections to the different Task pages */}
          <nav className="secondary-navbar">
            <p className="prefix">DASHBOARD</p>
            {secondaryButtonProps.map((button, index) => (
              <button key={index} className={selectedSecondaryButton === index ? "selected-button" : "button"} onClick={() => button.onClick(index)}>
                {button.text}
              </button>
            ))}
          </nav>

          {/* Main Task Contents */}
          <main className="dashboard-contents">
            {/* Main Task Header */}
            <div className="header">
              <input type="text" placeholder="Search tasks..." value={searchText} className="search-bar" onChange={(e) => setSearchText(e.target.value)} />
              {/* hoverText="Add Task" hoverCssStyle="add-button-hover" ╋ */}
              <IconButton primaryText="✚ Add Task" cssStyle="action-button" onClick={() => setCreateTask(true)} />
            </div>
            {/* Change This Header Accordingly */}
            <h2 style={{ textAlign: "left", margin: "0.7rem", fontSize: "30px" }}>{header}</h2>
            {/* Main Task Cards */}
            <div className="task-grid">
              {filteredSearchTasks.map((task, index) => (
                <TaskCard key={index} {...task} onEdit={handleEditTask} onOpenEdit={handleOpenEdit} onDelete={handleDeleteTask} />
              ))}
            </div>
          </main>
        </div>
        {/* Create New Task Page */}
        {(createTask || modifyTask) && (
          <form
            className="create-task-container"
            onSubmit={(e) => {
              createTask ? handleCreateTask(e) : handleEditTaskEvent(e);
            }}
          >
            <div className="new-task-contents">
              <h2>{createTask ? "Create New Task" : "Update Task"}</h2>
              <input type="text" placeholder="Task Title" name="title" className="title" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} />
              <textarea placeholder="Task Description" name="contents" className="contents" value={newTaskContents} onChange={(e) => setNewTaskContents(e.target.value)} />
              <div className="footer">
                <button type="submit" className={enableTaskAction ? "action-button" : "action-button-inactive"} disabled={!enableTaskAction}>
                  {createTask ? "Create Task" : "Update Task"}
                </button>
                <button
                  onClick={() => {
                    // Close Update/Create Task Window
                    setCreateTask(false);
                    setModifyTask(false);

                    // Reset Values
                    setNewTaskTitle("");
                    setNewTaskContents("");
                    setNewTaskId(-1);
                    setNewTaskStatus(false);
                  }}
                  className="action-button"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default UserDashboardView;
