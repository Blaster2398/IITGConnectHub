import useFetch from "../../hooks/useFetch";
import "./boardList.css";

const BoardList = () => {
  const { data, loading, error } = useFetch("/teams/countByBoard");

  const images = [
    "https://i.imgur.com/O6606qM.jpeg", // Technical
    "https://i.imgur.com/s6n8i8r.jpeg", // Cultural
    "https://i.imgur.com/yTz2voF.jpeg", // Welfare
    "https://i.imgur.com/SAFD2G1.jpeg", // Sports
    "https://i.imgur.com/qEaU8yN.jpeg", // HAB
  ];

  return (
    <div className="bList">
      {loading ? (
        "Loading, please wait"
      ) : (
        <>
          {data &&
            images.map((img, i) => (
              <div className="bListItem" key={i}>
                <img src={img} alt="" className="bListImg" />
                <div className="bListTitles">
                  <h1>{data[i]?.board} Board</h1>
                  <h2>{data[i]?.count} teams</h2>
                </div>
              </div>
            ))}
        </>
      )}
    </div>
  );
};

export default BoardList;
