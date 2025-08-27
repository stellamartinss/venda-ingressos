import { Navigate, useOutletContext } from 'react-router-dom';
import { AuthContextType } from '../organizer/OrganizerLoginPage';

interface ProtectedRouteProps {
  isAuthenticated?: boolean;
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { auth } = useOutletContext<AuthContextType>(); // assuming your context provides `user` or `isAuthenticated`

  if (!auth) {
    return <Navigate to='/organizador/login' replace />;
  }

  return children;
};

export default ProtectedRoute;
