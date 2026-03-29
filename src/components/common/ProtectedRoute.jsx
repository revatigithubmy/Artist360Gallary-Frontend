import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  
  if (loading) {
    return <div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-white">Loading Auth...</div>;
  }

 
  if (!user) {
    console.log("Access Denied: No user found in AuthContext");
    return <Navigate to="/" />;
  }

  
  return children;
};

export default ProtectedRoute;