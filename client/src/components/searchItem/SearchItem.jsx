import { Link } from "react-router-dom";
import "./searchItem.css";

const SearchItem = ({ item }) => {
  return (
    <div className="searchItem">
      <img
        src={item.photos[0] || "https://i.imgur.com/62daJt2.jpeg"}
        alt=""
        className="siImg"
      />
      <div className="siDesc">
        <h1 className="siTitle">{item.name}</h1>
        <span className="siBoard">{item.board} Board</span>
        <span className="siCategory">Category: {item.category}</span>
        <span className="siFeatures">{item.desc}</span>
      </div>
      <div className="siDetails">
        {item.rating && (
          <div className="siRating">
            <span>Excellent</span>
            <button>{item.rating}</button>
          </div>
        )}
        <div className="siDetailTexts">
          <Link to={`/teams/${item._id}`}>
            <button className="siCheckButton">View Openings</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SearchItem;
