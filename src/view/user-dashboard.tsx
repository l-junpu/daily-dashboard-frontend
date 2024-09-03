import "./user-dashboard.css";

import TaskSection from "../component/task-section/task-section";

const UserDashboardView = () => {
  const weekdays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday"
  ]

  return (
    <div className="dashboard-container">
      <div className="left-sidebar">Left Sidebar</div>
      <div className="top-content">
        <div className="top-bar">Top Bar 1</div>
        <div className="second-top-bar">Top Bar 2</div>
        <div className="main-content">
          <div className="card-view">
            {weekdays.map((day_string, index) => (
              <TaskSection day={day_string} />
            ))}
          </div>
          <div className="member-view">Member View</div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardView;
