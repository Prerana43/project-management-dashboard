import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


function Navbar({ role }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="navbar">
      <div>
        <h2>Project Dashboard</h2>

        <p className="role-badge">
          {role === "admin"
            ? "👑 Administrator"
            : "👤 Member"}
        </p>
      </div>

      <button
        className="logout-btn"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}

export default Navbar;