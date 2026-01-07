import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../services/userService";
import inventoryImg from "../assets/inventory.png";
import "../styles.css";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("MANAGER");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");

  // ---------------- LOGIN ----------------
  const handleLogin = async () => {
    setError("");
    try {
      const response = await loginUser({
        username: username,
        password: password,
      });

      // ✅ VERY IMPORTANT FIX
      // Store logged-in user for Dashboard
      localStorage.setItem(
        "user",
        JSON.stringify({
          username: response.username || username,
          role: response.role || "MANAGER",
          emailId: response.emailId || ""
        })
      );

      // ✅ Redirect to Dashboard
      navigate("/dashboard");

    } catch (err) {
      setError("Invalid username or password");
    }
  };

  // ---------------- REGISTER ----------------
  const handleRegister = async () => {
    setError("");
    try {
      await registerUser({
        username,
        emailId,
        password,
        role,
      });

      alert("Registration successful! Please sign in.");
      setIsRegister(false);
      setUsername("");
      setEmailId("");
      setPassword("");
    } catch (err) {
      setError("Registration failed. Try again.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">

        {/* LEFT SIDE */}
        <div className="login-left">
          <h1>{isRegister ? "Create Account" : "Sign In"}</h1>
          <p>
            {isRegister
              ? "Register to access Inventory Forecasting System"
              : "Sign in to access Inventory Forecasting System"}
          </p>

          {error && <div className="error">{error}</div>}

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          {isRegister && (
            <input
              type="email"
              placeholder="Email ID"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
            />
          )}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {isRegister && (
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="MANAGER">Manager</option>
              <option value="EMPLOYEE">Employee</option>
            </select>
          )}

          <button
            className="primary"
            onClick={isRegister ? handleRegister : handleLogin}
          >
            {isRegister ? "Register" : "Sign In"}
          </button>

          <div className="switch-text">
            {isRegister ? "Already have an account?" : "New user?"}{" "}
            <span onClick={() => setIsRegister(!isRegister)}>
              {isRegister ? "Sign In" : "Create account"}
            </span>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="login-right">
          <img src={inventoryImg} alt="Inventory" />
          <h2>Inventory Forecasting System</h2>
          <p>
            Manage products, track sales, and forecast inventory demand using
            intelligent data insights backed by real database analytics.
          </p>
        </div>

      </div>
    </div>
  );
}

export default Login;
