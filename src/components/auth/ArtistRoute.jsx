import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ArtistRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  if (!user || user.role !== 'ARTIST') {
    console.warn("Access denied: User is not an artist");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ArtistRoute;
