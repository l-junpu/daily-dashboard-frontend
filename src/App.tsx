import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPageView from "./view/login-page";
import UserDashboardView from "./view/user-dashboard";
import LLMDashboardView from "./view/llm/dashboard/llm-dashboard";
import LLMFileUploadView from "./view/llm-file-upload";
import LLMInspectDBView from "./view/llm-inspect-db";
import { LLMDashboardContextProvider } from "./context/llm-dashboard/context-provider";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPageView />} />
        <Route path="/dashboard/tasks" element={<UserDashboardView />} />
        <Route
          path="/dashboard/llm/conversations"
          element={
            <LLMDashboardContextProvider>
              <LLMDashboardView />
            </LLMDashboardContextProvider>
          }
        />
        <Route path="/dashboard/llm/inspect-db" element={<LLMInspectDBView />} />
        <Route path="dashboard/llm/upload-docs" element={<LLMFileUploadView />} />
        {/* <Route path="/dashboard/llm/conversations" element={<UserDashboardView />} /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
