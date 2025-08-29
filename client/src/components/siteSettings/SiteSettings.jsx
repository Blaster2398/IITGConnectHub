import { useState, useEffect } from "react";
import axios from "axios";
import "./siteSettings.css";

const SiteSettings = () => {
  const [keys, setKeys] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const boards = ["Cultural", "Technical", "Welfare", "Sports", "HAB"];

  useEffect(() => {
    const fetchKeys = async () => {
      try {
        const res = await axios.get("/settings");
        // Ensure all boards have keys, even if not in DB, to prevent errors
        const completeKeys = {
          registration: {},
          deletion: {},
        };
        boards.forEach(board => {
            completeKeys.registration[board] = res.data?.registration?.[board] || '';
            completeKeys.deletion[board] = res.data?.deletion?.[board] || '';
        });
        setKeys(completeKeys);
      } catch (err) {
        setError("Failed to load settings.");
      } finally {
        setLoading(false);
      }
    };
    fetchKeys();
  }, []);

  const handleChange = (type, board, value) => {
    setKeys(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          [board]: value,
        },
    }));
  };

  const handleSave = async () => {
    setError(null);
    setSuccess(false);
    try {
      await axios.put("/settings", { keys });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000); // Hide success message after 3s
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save settings.");
    }
  };

  if (loading) return <div>Loading settings...</div>;
  if (error && !keys) return <div className="settingsError">{error}</div>;

  return (
    <div className="siteSettings">
      <h3>Site-Wide Passkey Management</h3>
      <p>Configure the secret keys required for admin registration and team deletion for each board.</p>
      <table className="keysTable">
        <thead>
          <tr>
            <th>Board</th>
            <th>Admin Registration Key</th>
            <th>Team Deletion Key</th>
          </tr>
        </thead>
        <tbody>
          {boards.map((board) => (
            <tr key={board}>
              <td>{board}</td>
              <td>
                <input
                  type="text"
                  className="keyInput"
                  value={keys.registration[board]}
                  onChange={(e) => handleChange("registration", board, e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  className="keyInput"
                  value={keys.deletion[board]}
                  onChange={(e) => handleChange("deletion", board, e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleSave} className="saveKeysBtn">Save All Keys</button>
      {error && <div className="settingsError">{error}</div>}
      {success && <div className="settingsSuccess">Keys updated successfully!</div>}
    </div>
  );
};

export default SiteSettings;

