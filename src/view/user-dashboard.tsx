import "./user-dashboard.css";

const UserDashboardView = () => {
  return (
    <div className="dashboard-container">
      <div className="left-sidebar">Left Sidebar</div>
      <div className="top-content">
        <div className="top-bar">Top Bar 1</div>
        <div className="second-top-bar">Top Bar 2</div>
        <div className="main-content">Body</div>
      </div>
    </div>
  );
};

export default UserDashboardView;
