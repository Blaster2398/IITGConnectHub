import "./navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  // NEW: Check if the user is an admin
  const isAdmin = user && (user.role === 'BoardAdmin' || user.role === 'SuperAdmin');

  return (
    <div className="navbar">
      <div className="navContainer">
        <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
          <span className="logo">IITG ConnectHub</span>
        </Link>
        {user ? (
          <div className="userActions">
            <span className="username">{user.username}</span>
            {/* NEW: Conditionally render Admin Panel button */}
            {isAdmin && (
              <Link to="/admin">
                <button className="navButton adminPanelBtn">Admin Panel</button>
              </Link>
            )}
            <button onClick={handleLogout} className="navButton">Logout</button>
          </div>
        ) : (
          <div className="navButtons">
            <button onClick={handleRegister} className="navButton">Register</button>
            <button onClick={handleLogin} className="navButton">Login</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;

