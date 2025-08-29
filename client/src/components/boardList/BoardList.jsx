import useFetch from "../../hooks/useFetch";
import "./boardList.css";

const BoardList = () => {
  const { data, loading, error } = useFetch("/teams/countByBoard");

  const images = [
    "https://i.postimg.cc/6pGrvSD4/tech-logo.jpg", // Technical
    "https://i.postimg.cc/CxD818qj/about-cult.png", // Cultural
    "https://i.postimg.cc/qqStBBBb/welfare-board.png", // Welfare
    "https://i.postimg.cc/XYMZTvzX/sports-board-logo.jpg", // Sports
    "https://i.postimg.cc/ydrxn6R1/hab.png", // HAB
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
