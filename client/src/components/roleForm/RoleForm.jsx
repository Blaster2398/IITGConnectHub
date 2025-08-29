import { useState } from 'react';
import axios from 'axios';
import './roleForm.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';

const RoleForm = ({ role, teamId, setIsOpen, onFinished }) => {
  const [formData, setFormData] = useState({
    title: role?.title || '',
    timeCommitment: role?.timeCommitment || 0,
    positionsAvailable: role?.positionsAvailable || 1,
    desc: role?.desc || '',
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = async () => {
    setError(null);
    try {
      let savedRole;
      if (role) {
        // Update existing role
        const res = await axios.put(`/roles/${role._id}`, formData);
        savedRole = res.data;
      } else {
        // Create new role for the team
        const res = await axios.post(`/roles/${teamId}`, formData);
        savedRole = res.data;
      }
      onFinished(savedRole); // Pass the new/updated role back to the parent
      setIsOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save the role.");
    }
  };

  return (
    <div className="roleFormModal">
      <div className="roleFormContainer">
        <FontAwesomeIcon
          icon={faCircleXmark}
          className="roleFormClose"
          onClick={() => setIsOpen(false)}
        />
        <h2>{role ? 'Edit Role' : 'Add New Role'}</h2>
        <div className="roleFormGroup">
          <label htmlFor="title">Role Title</label>
          <input type="text" id="title" value={formData.title} onChange={handleChange} />
        </div>
        <div className="roleFormGroup">
          <label htmlFor="desc">Description</label>
          <textarea id="desc" value={formData.desc} onChange={handleChange}></textarea>
        </div>
        <div className="roleFormGroup">
          <label htmlFor="timeCommitment">Time Commitment (hours/week)</label>
          <input type="number" id="timeCommitment" value={formData.timeCommitment} onChange={handleChange} />
        </div>
        <div className="roleFormGroup">
          <label htmlFor="positionsAvailable">Positions Available</label>
          <input type="number" id="positionsAvailable" value={formData.positionsAvailable} onChange={handleChange} />
        </div>
        {error && <div className="roleFormError">{error}</div>}
        <button onClick={handleSave} className="roleFormSaveBtn">Save Role</button>
      </div>
    </div>
  );
};

export default RoleForm;

