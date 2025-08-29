import {
  faBriefcase,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./header.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = ({ type }) => {
  const [category, setCategory] = useState("");
  const navigate = useNavigate();

  // MODIFIED: This function now navigates even if the category is empty.
  // The List page will handle an empty category by showing all teams.
  const handleSearch = () => {
    navigate("/teams", { state: { category } });
  };

  return (
    <div className="header">
      <div
        className={
          type === "list" ? "headerContainer listMode" : "headerContainer"
        }
      >
        <div className="headerList">
          <div className="headerListItem active">
            <FontAwesomeIcon icon={faBriefcase} />
            <span>Find Teams</span>
          </div>
          <div className="headerListItem">
            <FontAwesomeIcon icon={faUsers} />
            <span>Student Profiles</span>
          </div>
        </div>
        {type !== "list" && (
          <>
            <h1 className="headerTitle">
              Find Your Next Project, Team, or Fest Gig.
            </h1>
            <p className="headerDesc">
              Discover opportunities within IIT Guwahati's vibrant campus community.
            </p>
            <div className="headerSearch">
              <div className="headerSearchItem">
                <FontAwesomeIcon icon={faBriefcase} className="headerIcon" />
                <input
                  type="text"
                  placeholder="What category are you looking for? (e.g., Fest)"
                  className="headerSearchInput"
                  onChange={(e) => setCategory(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <div className="headerSearchItem">
                <button className="headerBtn" onClick={handleSearch}>
                  Search
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;

