import "./list.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import { useLocation } from "react-router-dom";
import { useState, useMemo } from "react";
import SearchItem from "../../components/searchItem/SearchItem";
import useFetch from "../../hooks/useFetch";

const List = () => {
  const location = useLocation();
  const [category, setCategory] = useState(location.state?.category || "");
  const [tag, setTag] = useState(""); // State for the new tag filter
  const [minAvailability, setMinAvailability] = useState(0); // State for availability

  // This will re-build the URL whenever a filter changes, triggering useFetch to get new data
  const searchUrl = useMemo(() => {
    let url = "/teams?";
    if (category) url += `category=${category}&`;
    if (tag) url += `tag=${tag}&`;
    if (minAvailability > 0) url += `minAvailability=${minAvailability}&`;
    return url;
  }, [category, tag, minAvailability]);
  
  const { data, loading, reFetch } = useFetch(searchUrl);

  const handleClick = () => {
    reFetch();
  };
  
  const tagOptions = ["webops", "ml", "events", "infra", "pr", "branding", "media", "design", "marketing", "appops"];

  return (
    <div>
      <Navbar />
      <Header type="list" />
      <div className="listContainer">
        <div className="listWrapper">
          <div className="listSearch">
            <h1 className="lsTitle">Search</h1>
            <div className="lsItem">
              <label>Category</label>
              <input 
                placeholder="e.g., Fest, Club"
                type="text" 
                value={category}
                onChange={e=>setCategory(e.target.value)}
              />
            </div>
            {/* NEW: Dropdown for filtering by tags */}
            <div className="lsItem">
              <label>Team Type / Skill</label>
              <select className="lsSelect" value={tag} onChange={e => setTag(e.target.value)}>
                <option value="">Any</option>
                {tagOptions.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            {/* NEW: Input for minimum availability */}
            <div className="lsItem">
              <label>Minimum Open Positions</label>
              <input
                type="number"
                min="0"
                className="lsInput"
                value={minAvailability}
                onChange={e => setMinAvailability(e.target.value)}
                placeholder="e.g., 2"
              />
            </div>
            <button onClick={handleClick}>Search</button>
          </div>
          <div className="listResult">
            {loading ? (
              "loading"
            ) : (
              <>
                {data.length > 0 ? (
                  data.map((item) => (
                    <SearchItem item={item} key={item._id} />
                  ))
                ) : (
                   <p>No teams found with the selected filters.</p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
