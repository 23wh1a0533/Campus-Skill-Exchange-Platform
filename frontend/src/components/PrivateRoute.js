import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

const PrivateRoute = () => {
  const { user, loading } = useAuth();
  
  if (loading) return <Loader />;
  
  if (!user) return <Navigate to="/login" />;
  
  if (!user.isOnboardingComplete && window.location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" />;
  }
  
  return <Outlet />;
};

export default PrivateRoute;