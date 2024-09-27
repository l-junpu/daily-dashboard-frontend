import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPageView from "./view/login-page";
import UserDashboardView from "./view/user-dashboard";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPageView />} />
        <Route path="/dashboard" element={<UserDashboardView />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
