import "./footer.css";

const Footer = () => {
  return (
    <div className="footer">
      <div className="fLists">
        <ul className="fList">
          <li className="fListItem">Technical Board</li>
          <li className="fListItem">Cultural Board</li>
          <li className="fListItem">Welfare Board</li>
          <li className="fListItem">Sports Board</li>
          <li className="fListItem">HAB</li>
        </ul>
        <ul className="fList">
          <li className="fListItem">Fests </li>
          <li className="fListItem">Clubs </li>
          <li className="fListItem">Projects </li>
          <li className="fListItem">Startups</li>
          <li className="fListItem">Research Groups</li>
        </ul>
        <ul className="fList">
          <li className="fListItem">About Us</li>
          <li className="fListItem">Contact</li>
          <li className="fListItem">Terms & conditions</li>
        </ul>
      </div>
      <div className="fText">Copyright © 2024 IITG ConnectHub.</div>
    </div>
  );
};

export default Footer;
