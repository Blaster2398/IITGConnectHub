import BoardList from "../../components/boardList/BoardList";
import FeaturedTeams from "../../components/featuredTeams/FeaturedTeams";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import MailList from "../../components/mailList/MailList";
import Navbar from "../../components/navbar/Navbar";
import "./home.css";

const Home = () => {
  return (
    <div>
      <Navbar />
      <Header />
      <div className="homeContainer">
        <h1 className="homeTitle">Browse by Board</h1>
        <BoardList />
        <h1 className="homeTitle">Featured Teams & Projects</h1>
        <FeaturedTeams />
        <MailList />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
