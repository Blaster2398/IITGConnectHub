import "./team.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import MailList from "../../components/mailList/MailList";
import Footer from "../../components/footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { useContext, useState } from "react";
import useFetch from "../../hooks/useFetch";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Apply from "../../components/apply/Apply";
import ApplicantDashboard from "../../components/applicantDashboard/ApplicantDashboard";

const Team = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const [openModal, setOpenModal] = useState(false);

  const { data: teamData, loading } = useFetch(`/teams/find/${id}`);
  const { data: rolesData } = useFetch(`/teams/role/${id}`);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleClick = () => {
    if (user) {
      // Admins should not see the apply modal
      if (user.role && user.role !== "Student") {
        alert("Admins cannot apply for roles.");
        return;
      }
      setOpenModal(true);
    } else {
      navigate("/login");
    }
  };

  // NEW: Check to determine if the current user is an authorized admin for THIS team
  const isAuthorizedAdmin = user && (
    user.role === 'SuperAdmin' ||
    (user.role === 'BoardAdmin' && user.adminOf === teamData.board)
  );

  return (
    <div>
      <Navbar />
      <Header type="list" />
      {loading ? (
        "loading"
      ) : (
        <div className="teamContainer">
          <div className="teamWrapper">
            {/* MODIFIED: Only show Apply button to non-admins */}
            {user?.role === "Student" && (
              <button onClick={handleClick} className="applyNow">
                Apply Now!
              </button>
            )}
            <h1 className="teamTitle">{teamData.name}</h1>
            <div className="teamAddress">
              <FontAwesomeIcon icon={faUsers} />
              <span>{teamData.board} Board</span>
            </div>
            <span className="teamCategory">
              A leading {teamData.category} on campus
            </span>
            
            <div className="teamDetails">
              <div className="teamDetailsTexts">
                <h1 className="teamTitle">About the Team</h1>
                <p className="teamDesc">{teamData.desc}</p>
              </div>
              <div className="teamDetailsPrice">
                <h1>Join our team!</h1>
                <span>
                  This is a great opportunity to gain experience and contribute to exciting projects.
                </span>
                {/* MODIFIED: Only show Apply button to non-admins */}
                {(!user || user.role === "Student") && (
                    <button onClick={handleClick}>Apply Now!</button>
                )}
              </div>
            </div>
            
            {/* MODIFIED: Show Admin Dashboard only to authorized admins */}
            {isAuthorizedAdmin && (
              <div className="adminSection">
                <h2>Admin Dashboard</h2>
                {rolesData.map(role => (
                  <div key={role._id} className="roleManagementSection">
                    <h3>{role.title}</h3>
                    <ApplicantDashboard 
                      roleId={role._id} 
                      initialPositions={role.positionsAvailable}
                      initialOriginalPositions={role.originalPositions}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          <MailList />
          <Footer />
        </div>
      )}
      {openModal && <Apply setOpen={setOpenModal} teamId={id} />}
    </div>
  );
};

export default Team;
