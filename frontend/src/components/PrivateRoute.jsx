import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  // Check the Redux store to see if a token exists.
  const { token } = useSelector((state) => state.auth);

  // If a token exists, the user is authenticated. Render the requested page.
  // The <Outlet /> here will be replaced by our protected component (e.g., DashboardPage).
  if (token) {
    return <Outlet />;
  }

  // If no token exists, redirect the user to the login page.
  return <Navigate to="/login" replace />;
};

export default PrivateRoute;