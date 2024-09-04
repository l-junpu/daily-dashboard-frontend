import "./user-dashboard.css";

import TaskSection from "../component/task-section/task-section";
import GeneralHeader from "../component/general-header/general-header";
import ProjectHeader from "../component/project-header/project-header";

import Calendar from "react-calendar";
import { useState } from "react";

const UserDashboardView = () => {
  const [date, setDate] = useState(new Date());
  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const getWeekNumber = (date: Date) => {
    const oneJan = new Date(date.getFullYear(), 0, 1);
    return Math.ceil(((date.getTime() - oneJan.getTime()) / 86400000 + oneJan.getDay() + 1) / 7);
  };

  const isCurrentWeek = (date: Date) => {
    const currentWeek = getWeekNumber(new Date());
    const dateWeek = getWeekNumber(date);
    return currentWeek === dateWeek;
  };

  const isWeekday = (date: Date) => {
    const day = date.getDay();
    return day >= 1 && day <= 5; // Monday to Friday
  };

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
          <div className="card-view-wrapper-with-calendar">
            <div className="card-view">
              {weekdays.map((day_string, index) => (
                <TaskSection key={index} day={day_string} />
              ))}
            </div>
            <div className="calendar-view">
              <Calendar
                className="calendar-style"
                value={date}
                /* Checks whether date == today and returns either "calendar-highlight-week" or "calendar-highlight-day" or "" as the cssStyle depending on the conditions */
                /* Wrap this whole thing into a function later so I can create a rounding effect */
                tileClassName={({ date }) => {
                  const today = new Date();
                  const isToday = date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
                  return isCurrentWeek(date) && isWeekday(date) && !isToday ? "calendar-highlight-week" : isToday ? "calendar-highlight-day" : "";
                }}
              />
            </div>
          </div>
          <div className="member-view">Member View</div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardView;
