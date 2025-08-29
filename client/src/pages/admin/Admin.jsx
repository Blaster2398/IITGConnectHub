import { useContext, useState } from "react";
import useFetch from "../../hooks/useFetch";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../../components/navbar/Navbar";
import TeamForm from "../../components/teamForm/TeamForm";
import SiteSettings from "../../components/siteSettings/SiteSettings";
import ApplicantDashboard from "../../components/applicantDashboard/ApplicantDashboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import "./admin.css";
import axios from "axios";

const Admin = () => {
  const { user } = useContext(AuthContext);
  const { data: teams, loading, error, reFetch } = useFetch("/teams/admin/managed");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [openTeamId, setOpenTeamId] = useState(null);
  const [deletingTeam, setDeletingTeam] = useState(null);
  const [deletionKey, setDeletionKey] = useState("");
  const [deleteError, setDeleteError] = useState(null);

  const [teamRoles, setTeamRoles] = useState({});

  const handleToggleApplicants = async (teamId) => {
    if (openTeamId === teamId) {
      setOpenTeamId(null);
    } else {
      setOpenTeamId(teamId);
      if (!teamRoles[teamId]) {
        try {
          const res = await axios.get(`/teams/role/${teamId}`);
          setTeamRoles(prev => ({ ...prev, [teamId]: res.data }));
        } catch (err) {
          console.error("Failed to fetch roles for team", teamId, err);
        }
      }
    }
  };

  const handleCreateNew = () => {
    setEditingTeam(null);
    setIsFormOpen(true);
  };

  const handleEdit = (team) => {
    setEditingTeam(team);
    setIsFormOpen(true);
  };

  const handleDeleteAttempt = (team) => {
    setDeletingTeam(team);
    setDeleteError(null);
    setDeletionKey("");
  };

  const handleDeleteConfirm = async () => {
    if (!deletingTeam) return;
    try {
      await axios.delete(`/teams/${deletingTeam._id}`, {
        data: { deletionKey },
      });
      setDeletingTeam(null);
      reFetch();
    } catch (err) {
      setDeleteError(err.response?.data?.message || "Deletion failed.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="adminContainer">
        <div className="adminHeader">
          <h1>Admin Control Center</h1>
          <button onClick={handleCreateNew} className="createNewBtn">
            Create New Team
          </button>
        </div>

        {user?.role === "SuperAdmin" && <SiteSettings />}

        <div className="managedTeamsSection">
          <h2>Your Managed Teams</h2>
          {loading ? (
            <p>Loading your teams...</p>
          ) : error ? (
            <p className="adminError">Error loading teams.</p>
          ) : (
            <div className="managedTeamsList">
              {teams.map((team) => (
                <div key={team._id} className="managedTeamItem">
                  <div className="teamItemHeader">
                    <h3>{team.name}</h3>
                    <div className="teamItemActions">
                      <button onClick={() => handleEdit(team)} className="editBtn">
                        Edit Team & Roles
                      </button>
                      <button onClick={() => handleDeleteAttempt(team)} className="deleteBtn">
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="teamItemDetails">
                    <p><strong>Board:</strong> {team.board}</p>
                    <p><strong>Category:</strong> {team.category}</p>
                  </div>
                  <div
                    className="applicantsToggle"
                    onClick={() => handleToggleApplicants(team._id)}
                  >
                    <span>Show Applicants</span>
                    <FontAwesomeIcon icon={openTeamId === team._id ? faChevronUp : faChevronDown} />
                  </div>
                  {openTeamId === team._id && (
                    <div className="applicantsContainer">
                      {teamRoles[team._id] ? (
                        teamRoles[team._id].map(role => (
                          <div key={role._id} className="roleManagementSection">
                            <h4>{role.title}</h4>
                            <ApplicantDashboard
                              roleId={role._id}
                              initialPositions={role.positionsAvailable}
                              initialOriginalPositions={role.originalPositions}
                            />
                          </div>
                        ))
                      ) : (
                        <p>Loading applicants...</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {isFormOpen && (
        <TeamForm
          team={editingTeam}
          setIsOpen={setIsFormOpen}
          onFinished={reFetch}
        />
      )}

      {deletingTeam && (
        <div className="deleteModal">
          <div className="deleteModalContent">
            <h2>Confirm Deletion</h2>
            <p>You are about to delete the team: <strong>{deletingTeam.name}</strong>. This action cannot be undone.</p>
            <p>Please enter the <strong>{deletingTeam.board} Board</strong> deletion key to confirm.</p>
            <input
              type="password"
              placeholder="Deletion Passkey"
              value={deletionKey}
              onChange={(e) => setDeletionKey(e.target.value)}
              className="deleteKeyInput"
            />
            {deleteError && <p className="deleteErrorMsg">{deleteError}</p>}
            <div className="deleteModalActions">
              <button onClick={() => setDeletingTeam(null)} className="cancelBtn">Cancel</button>
              <button onClick={handleDeleteConfirm} className="confirmDeleteBtn">Delete Team</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;

