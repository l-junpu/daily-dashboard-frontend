import "./login-page.css";
import "react-toastify/dist/ReactToastify.css";

import { useState } from "react";
import { FaLock, FaUser } from "react-icons/fa";

import { FetchResponse, HttpStatusCode } from "../api/helper";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const LoginPageView = () => {
  const navigate = useNavigate();

  const [register, setRegister] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLoginOrRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    var api: string = "";

    if (register) {
      api = "http://localhost:8080/register";
    } else {
      api = "http://localhost:8080/login";
    }

    const response = await FetchResponse(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    if (response == null) {
      toast.error("Unable to connect to server");
      return;
    } else {
      switch (response.status) {
        case HttpStatusCode.OK:
          break;
        case HttpStatusCode.UNAUTHORIZED:
          toast.error("Incorrect username or password");
          return;
        default:
          toast.error(`Server side error: ${response.status}`);
          return;
      }
    }

    if (register) {
      handleToggleLoginRegister(false);
      toast.success("Successfully registered");
      return;
    }

    localStorage.setItem("username", username);
    sessionStorage.setItem("username", username);
    navigate("/dashboard/tasks", { replace: true });
  };

  const handleToggleLoginRegister = (status: boolean) => {
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setRegister(status);
  };

  return (
    <>
      <ToastContainer position="bottom-right" />
      {/* Container for the entire login or registration form */}
      <header className="login-header">SOBA AI</header>
      <div className="login-container">
        {/* Form element that handles submission with the handleLoginOrRegister function */}
        <form onSubmit={(e) => handleLoginOrRegister(e)}>
          {/* Header that dynamically changes between "Register" and "Login" based on the register state */}
          <h1 style={{ color: "var(--color-font)" }}>{register ? "Register" : "Login"}</h1>
          {/* Input field for the username */}
          <div className="login-input-box">
            <input name="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
            <FaUser className="login-icon" />
          </div>
          {/* Input field for the password */}
          <div className="login-input-box">
            <input name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
            <FaLock className="login-icon" />
          </div>
          {/* Conditional input field for confirming the password during registration */}
          {register && (
            <div className="login-input-box">
              <input name="confirm" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" required />
              <FaLock className="login-icon" />
            </div>
          )}
          {/* Submit button with dynamic text based on the register state */}
          <button type="submit" className="login-button">
            {register ? "Register" : "Login"}
          </button>
          {/* Link to toggle between login and registration */}
          <div className="register-link">
            <p>
              {register ? "Already have an account? " : "Don't have an account? "}
              <a href="#" onClick={() => handleToggleLoginRegister(!register)}>
                {register ? "Login" : "Register"}
              </a>
            </p>
          </div>
        </form>
      </div>
    </>
  );
};

export default LoginPageView;
