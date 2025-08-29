import "./list.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import SearchItem from "../../components/searchItem/SearchItem";
import useFetch from "../../hooks/useFetch";

const List = () => {
  const location = useLocation();
  const [category, setCategory] = useState(location.state?.category || "");

  // MODIFIED: Construct the URL conditionally. If category is empty, fetch all teams.
  const { data, loading, error, reFetch } = useFetch(
    category ? `/teams?category=${category}` : "/teams"
  );

  const handleClick = () => {
    reFetch();
  };

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
                value={category} // Use value to control the input
                onChange={(e) => setCategory(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleClick()}
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
                  <p>No teams found for this category.</p>
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
