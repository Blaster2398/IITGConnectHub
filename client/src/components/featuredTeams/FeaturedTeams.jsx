import useFetch from "../../hooks/useFetch";
import "./featuredTeams.css";
import { Link } from "react-router-dom";

const FeaturedTeams = () => {
  const { data, loading, error } = useFetch("/teams?featured=true&limit=4");

  return (
    <div className="ft">
      {loading ? (
        "Loading..."
      ) : (
        <>
          {data.map((item) => (
            <div className="ftItem" key={item._id}>
              <img
                src={item.photos[0] || "https://i.imgur.com/62daJt2.jpeg"}
                alt=""
                className="ftImg"
              />
              <div className="ftDesc">
                <span className="ftName">{item.name}</span>
                <span className="ftCategory">{item.category}</span>
                {item.rating && (
                  <div className="ftRating">
                    <button>{item.rating}</button>
                    <span>Excellent</span>
                  </div>
                )}
              </div>
              <Link to={`/teams/${item._id}`}>
                <button className="ftViewButton">View Openings</button>
              </Link>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default FeaturedTeams;
