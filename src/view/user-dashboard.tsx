import "./user-dashboard.css";

import TaskSection from "../component/task-section/task-section";
import GeneralHeader from "../component/general-header/general-header";
import ProjectHeader from "../component/project-header/project-header";

const UserDashboardView = () => {
  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  return (
    <div className="dashboard-container">
      <div className="left-sidebar">Left Sidebar</div>
      <div className="top-content">
        <div className="top-bar">
          <GeneralHeader />
        </div>
        <div className="second-top-bar">
          <ProjectHeader />
        </div>
        <div className="main-content">
          <div className="card-view">
            {weekdays.map((day_string, index) => (
              <TaskSection key={index} day={day_string} />
            ))}
          </div>
          <div className="member-view">Member View</div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardView;
