import React from 'react';
import useFetch from '../../hooks/useFetch';
import axios from 'axios';
import './applicantDashboard.css';

const ApplicantDashboard = ({ roleId, initialPositions, initialOriginalPositions }) => {
  const { data: applicants, loading, error, reFetch } = useFetch(
    `/roles/${roleId}/applicants`
  );
  
  // Use state to manage positions so the UI updates instantly
  const [positionsAvailable, setPositionsAvailable] = React.useState(initialPositions);
  const [originalPositions, setOriginalPositions] = React.useState(initialOriginalPositions);

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await axios.put(`/roles/status/${roleId}/${userId}`, { status: newStatus });
      // When status changes, we need to re-fetch everything to get the latest state
      reFetch(); 
      // Manually update the positions count for immediate UI feedback
      if (newStatus === "Accepted") {
          setPositionsAvailable(prev => prev - 1);
      }
    } catch (err) {
      console.error("Failed to update status", err);
      alert(err.response.data.message);
    }
  };

  const handleIncreaseOpenings = async () => {
      try {
          await axios.put(`/roles/increase/${roleId}`);
          setPositionsAvailable(prev => prev + 1);
          setOriginalPositions(prev => prev + 1);
      } catch (err) {
          console.error("Failed to increase openings", err);
          alert(err.response.data.message);
      }
  };

  // NEW: Handler for decreasing openings
  const handleDecreaseOpenings = async () => {
    if (positionsAvailable <= 0) {
        alert("Cannot decrease openings below zero.");
        return;
    }
    try {
        await axios.put(`/roles/decrease/${roleId}`);
        setPositionsAvailable(prev => prev - 1);
        setOriginalPositions(prev => prev - 1);
    } catch (err) {
        console.error("Failed to decrease openings", err);
        alert(err.response.data.message);
    }
  };


  if (loading) return <p>Loading applicants...</p>;
  if (error) return <p>Error loading applicants: {error.response?.data?.message || error.message}</p>;

  return (
    <div className="applicantDashboard">
      <div className="adHeader">
        <h3 className="adTitle">Applicants</h3>
        <div className="positionsInfo">
            <span>Openings: {positionsAvailable} / {originalPositions}</span>
            {/* NEW: Decrease button added */}
            <button onClick={handleDecreaseOpenings} className="decreaseBtn" disabled={positionsAvailable <= 0}>-</button>
            <button onClick={handleIncreaseOpenings} className="increaseBtn">+</button>
        </div>
      </div>
      {applicants.length === 0 ? (
        <p>No applicants yet.</p>
      ) : (
        <table className="adTable">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Skills</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map((applicant) => (
              <tr key={applicant._id}>
                <td>{applicant.username}</td>
                <td>{applicant.email}</td>
                <td>{applicant.skills?.join(', ') || 'No skills listed'}</td>
                <td>
                  <span className={`adStatus ${applicant.applicationStatus?.toLowerCase()}`}>
                    {applicant.applicationStatus}
                  </span>
                </td>
                <td>
                  <select
                    className="adActionSelect"
                    defaultValue={applicant.applicationStatus}
                    onChange={(e) => handleStatusChange(applicant._id, e.target.value)}
                    disabled={positionsAvailable <= 0 && applicant.applicationStatus !== 'Accepted'}
                  >
                    <option value="Applied">Applied</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="Accepted">Accept</option>
                    <option value="Rejected">Reject</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ApplicantDashboard;
