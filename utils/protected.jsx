import { Navigate, useLocation } from "react-router-dom";
import { useLogged } from "../hooks/useLogged";
const Protected = ({children}) => {
  const location = useLocation()
  const isLoggedIn = useLogged()
  if (!isLoggedIn) {
  return <Navigate to="/login" state={{ from : location}} replace={true} />;
  }
  return children;
};
export { Protected };