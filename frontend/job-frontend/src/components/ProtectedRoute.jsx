import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, adminOnly = false }) {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) return <Navigate to="/" replace />;
    if (adminOnly && user?.role !== 'admin') return <Navigate to="/jobs" replace />;

    return children;
}
