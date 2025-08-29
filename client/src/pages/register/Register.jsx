import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./register.css";

const Register = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [board, setBoard] = useState("Cultural"); // Default board
  const [adminKey, setAdminKey] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const boardOptions = ["Cultural", "Technical", "Welfare", "Sports", "HAB"];

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    let registrationData = { ...credentials };
    if (isAdmin) {
      registrationData = { ...registrationData, board, adminKey };
    }

    try {
      await axios.post("/auth/register", registrationData);
      navigate("/login");
    } catch (err) {
      setError(err.response.data);
    }
  };

  return (
    <div className="register">
      <div className="rContainer">
        <h1>Create an Account</h1>
        <input
          type="text"
          placeholder="username"
          id="username"
          onChange={handleChange}
          className="rInput"
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          onChange={handleChange}
          className="rInput"
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          onChange={handleChange}
          className="rInput"
        />
        
        {/* NEW: Admin Registration Toggle */}
        <div className="rAdminToggle">
          <input
            type="checkbox"
            id="isAdmin"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
          />
          <label htmlFor="isAdmin">Register as a Board Admin</label>
        </div>

        {/* NEW: Conditional fields for admin registration */}
        {isAdmin && (
          <div className="rAdminFields">
            <select id="board" value={board} onChange={(e) => setBoard(e.target.value)}>
              {boardOptions.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            <input
              type="password"
              placeholder="Admin Registration Key"
              id="adminKey"
              onChange={(e) => setAdminKey(e.target.value)}
              className="rInput"
            />
          </div>
        )}

        <button onClick={handleClick} className="rButton">
          Register
        </button>
        {error && <span>{error.message}</span>}
      </div>
    </div>
  );
};

export default Register;

