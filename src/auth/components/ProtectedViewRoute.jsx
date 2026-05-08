import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getDefaultRouteForUser } from "../utils/auth-user.utils";

const ProtectedViewRoute = ({ view, children }) => {
  const { user, canAccessView } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!canAccessView(view)) {
    return <Navigate to={getDefaultRouteForUser(user)} replace />;
  }

  return children;
};

export default ProtectedViewRoute;
