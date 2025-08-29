import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    // You can add a loading spinner here
    return <div>Loading...</div>;
  }
  
  const isAdmin = user && (user.role === 'BoardAdmin' || user.role === 'SuperAdmin');

  if (!isAdmin) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to. This is a good user experience because they can log in and
    // be sent directly to the page they wanted.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminRoute;

