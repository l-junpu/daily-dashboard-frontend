import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPageView from "./view/login-page";
import UserDashboardView from "./view/user-dashboard";
import LLMDashboardView from "./view/llm-dashboard";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPageView />} />
        <Route path="/dashboard/tasks" element={<UserDashboardView />} />
        <Route path="/dashboard/llm/conversations" element={<LLMDashboardView />} />
        {/* <Route path="/dashboard/llm/conversations" element={<UserDashboardView />} /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
