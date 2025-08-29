import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import "./apply.css";
import useFetch from "../../hooks/useFetch";
import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Apply = ({ setOpen, teamId }) => {
  const [selectedRoles, setSelectedRoles] = useState([]);
  const { data: roles, loading } = useFetch(`/teams/role/${teamId}`);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSelect = (e) => {
    const checked = e.target.checked;
    const value = e.target.value;
    setSelectedRoles(
      checked
        ? [...selectedRoles, value]
        : selectedRoles.filter((item) => item !== value)
    );
  };

  const handleClick = async () => {
    try {
      await Promise.all(
        selectedRoles.map((roleId) => {
          const res = axios.put(`/roles/apply/${roleId}`, {
            userId: user._id,
          });
          return res.data;
        })
      );
      setOpen(false);
      alert("Application successful!");
      navigate("/");
    } catch (err) {
      alert(err.response.data.message); // Show error message from backend
      console.error("Application failed", err);
    }
  };

  // Helper function to check if user has applied to a specific role
  const hasUserApplied = (role) => {
    if (!role || !role.applicants) return false;
    return role.applicants.some(applicant => applicant.userId === user._id);
  };

  return (
    <div className="apply">
      <div className="aContainer">
        <FontAwesomeIcon
          icon={faCircleXmark}
          className="aClose"
          onClick={() => setOpen(false)}
        />
        <span>Select roles to apply for:</span>
        {loading ? "Loading roles..." : roles.map((item) => (
          <div className="aItem" key={item._id}>
            <div className="aItemInfo">
              <div className="aTitle">{item.title}</div>
              <div className="aDesc">{item.desc}</div>
              <div className="aMax">
                Positions available: <b>{item.positionsAvailable > 0 ? item.positionsAvailable : "Filled"}</b>
              </div>
              <div className="aCommitment">
                Time Commitment: <b>{item.timeCommitment} hrs/week</b>
              </div>
            </div>
            <div className="aSelectRoles">
              <input
                type="checkbox"
                value={item._id}
                onChange={handleSelect}
                disabled={hasUserApplied(item) || item.positionsAvailable <= 0}
              />
               {hasUserApplied(item) && <span className="appliedText">Applied</span>}
            </div>
          </div>
        ))}
        <button onClick={handleClick} className="aButton">
          Apply Now!
        </button>
      </div>
    </div>
  );
};

export default Apply;
