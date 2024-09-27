import "./login-page.css";

import { useState } from "react";
import { FaLock, FaUser } from "react-icons/fa";

import FetchAPI from "../api/helper";
import { useNavigate } from "react-router-dom";

const LoginPageView = () => {
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [register, setRegister] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLoginOrRegister = async () => {
    var api: string = "";

    if (register) {
      api = "http://localhost:8080/register";
    } else {
      api = "http://localhost:8080/login";
    }

    const response = await FetchAPI(api, {
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
      setError("Unable to connect to server");
    } else {
      setError("");
      const status: boolean = response;

      if (!status) {
        setError("Incorrect username or password");
        return;
      }

      navigate(`/dashboard?username=${username}`, { replace: true });
    }
    console.log(response);
  };

  return (
    <div className="login-container">
      <form>
        <h1>{register ? "Register" : "Login"}</h1>

        <div className="login-input-box">
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
          <FaUser className="login-icon" />
        </div>

        <div className="login-input-box">
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
          <FaLock className="login-icon" />
        </div>

        {register && (
          <div className="login-input-box">
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" />
            <FaLock className="login-icon" />
          </div>
        )}

        <button type="submit" onClick={() => handleLoginOrRegister()}>
          {register ? "Register" : "Login"}
        </button>
        <div className="error-message">{error}</div>

        <div className="register-link">
          <p>
            {register ? "Already have an account? " : "Don't have an account? "}
            <a href="#" onClick={() => setRegister(!register)}>
              {register ? "Login" : "Register"}
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginPageView;
