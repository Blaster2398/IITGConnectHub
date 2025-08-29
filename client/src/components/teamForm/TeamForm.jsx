import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark, faPlus, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import TagInput from "../tagInput/TagInput";
import RoleForm from "../roleForm/RoleForm";
import "./teamForm.css";

const TeamForm = ({ team, setIsOpen, onFinished }) => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: team?.name || "",
    board: team?.board || (user.role === "BoardAdmin" ? user.adminOf : ""),
    category: team?.category || "",
    desc: team?.desc || "",
    photos: team?.photos?.join(", ") || "",
    tags: team?.tags || [],
    featured: team?.featured || false,
  });
  const [roles, setRoles] = useState([]);
  const [isRoleFormOpen, setIsRoleFormOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [error, setError] = useState(null);

  // NEW: Fetch full role details when the form opens for an existing team
  useEffect(() => {
    const fetchRoleDetails = async () => {
      if (team && team.roles && team.roles.length > 0) {
        // Check if roles are just strings (IDs)
        if (typeof team.roles[0] === 'string') {
           try {
              const res = await axios.get(`/teams/role/${team._id}`);
              setRoles(res.data);
           } catch (err) {
              console.error("Failed to fetch role details", err);
              setError("Could not load role details for this team.");
           }
        } else {
            // Roles are already full objects
            setRoles(team.roles);
        }
      }
    };
    fetchRoleDetails();
  }, [team]);


  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSaveTeam = async () => {
    setError(null);
    try {
      const payload = {
        ...formData,
        photos: formData.photos.split(",").map((url) => url.trim()),
        roles: roles.map(r => r._id), // Send only role IDs
      };

      if (team) {
        // Update existing team
        await axios.put(`/teams/${team._id}`, payload);
      } else {
        // Create new team
        await axios.post("/teams", payload);
      }
      onFinished(); // Re-fetch teams in Admin page
      setIsOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save team.");
    }
  };
  
  const handleOpenRoleForm = (role) => {
    setEditingRole(role);
    setIsRoleFormOpen(true);
  };

  const handleRoleFormFinished = (updatedRole) => {
      if (editingRole) {
          // Update existing role in state
          setRoles(roles.map(r => r._id === updatedRole._id ? updatedRole : r));
      } else {
          // Add new role to state
          setRoles([...roles, updatedRole]);
      }
      setIsRoleFormOpen(false);
  };

  const handleDeleteRole = async (roleIdToDelete) => {
      // Use a custom modal for confirm later, for now window.confirm is fine
      if(window.confirm("Are you sure you want to delete this role? This is permanent.")) {
        try {
            // We need the team ID to ensure the role belongs to the team on the backend
            await axios.delete(`/roles/${roleIdToDelete}/${team._id}`);
            setRoles(roles.filter(r => r._id !== roleIdToDelete));
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete role.");
        }
      }
  };

  return (
    <div className="formModal">
      <div className="formContainer twoColumn">
        <FontAwesomeIcon
          icon={faCircleXmark}
          className="formClose"
          onClick={() => setIsOpen(false)}
        />
        <div className="formColumn">
          <h3>{team ? "Edit Team Details" : "Create New Team"}</h3>
          <div className="formItem">
            <label htmlFor="name">Team Name</label>
            <input type="text" id="name" value={formData.name} onChange={handleChange} />
          </div>
          <div className="formItem">
            <label htmlFor="desc">Description</label>
            <textarea id="desc" value={formData.desc} onChange={handleChange}></textarea>
          </div>
          <div className="formItem">
            <label htmlFor="category">Category (e.g., Fest, Club)</label>
            <input type="text" id="category" value={formData.category} onChange={handleChange} />
          </div>
          <div className="formItem">
            <label htmlFor="board">Board</label>
            <select id="board" value={formData.board} onChange={handleChange} disabled={user.role !== 'SuperAdmin'}>
                <option value="">Select Board</option>
                <option value="Cultural">Cultural</option>
                <option value="Technical">Technical</option>
                <option value="Welfare">Welfare</option>
                <option value="Sports">Sports</option>
                <option value="HAB">HAB</option>
            </select>
          </div>
          <div className="formItem">
            <label htmlFor="photos">Image URLs (comma separated)</label>
            <input type="text" id="photos" value={formData.photos} onChange={handleChange} />
          </div>
           <div className="formItem">
            <label htmlFor="tags">Tags</label>
            <TagInput tags={formData.tags} setTags={(newTags) => setFormData(prev => ({ ...prev, tags: newTags }))} />
          </div>
          <div className="formItem featuredToggle">
            <label htmlFor="featured">Featured on Homepage?</label>
            <input type="checkbox" id="featured" checked={formData.featured} onChange={handleChange} />
          </div>
        </div>

        <div className="formColumn">
            <h3>Manage Roles</h3>
            <button type="button" className="addNewRoleBtn" onClick={() => handleOpenRoleForm(null)}>
                <FontAwesomeIcon icon={faPlus} /> Add New Role
            </button>
            <div className="rolesList">
                {roles.length > 0 ? roles.map(role => (
                    <div key={role._id} className="roleItem">
                        <span>{role.title} ({role.positionsAvailable}/{role.originalPositions} open)</span>
                        <div className="roleActions">
                            <button onClick={() => handleOpenRoleForm(role)}><FontAwesomeIcon icon={faPen} /></button>
                            <button onClick={() => handleDeleteRole(role._id)}><FontAwesomeIcon icon={faTrash} /></button>
                        </div>
                    </div>
                )) : <p>No roles created for this team yet.</p>}
            </div>
        </div>

        <div className="formActions">
          <button className="saveBtn" onClick={handleSaveTeam}>
            {team ? "Save Changes" : "Create Team"}
          </button>
          {error && <div className="formError">{error}</div>}
        </div>
      </div>
      {isRoleFormOpen && (
        <RoleForm
          role={editingRole}
          teamId={team?._id}
          setIsOpen={setIsRoleFormOpen}
          onFinished={handleRoleFormFinished}
        />
      )}
    </div>
  );
};

export default TeamForm;

