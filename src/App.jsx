import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer'; 

import ProtectedRoute from './components/common/ProtectedRoute'; 
import AdminRoute from './components/auth/AdminRoute';
import ArtistRoute from './components/auth/ArtistRoute';

import Home from './pages/Home';
import Login from './pages/Auth/Login';
import AdminLogin from './pages/Auth/AdminLogin';
import AdminRegister from './pages/Auth/AdminRegister';
import Register from './pages/Auth/Register';

import Profile from './pages/Artist/Profile';
import UploadArt from './pages/Artist/UploadArt';
import ArtistDashboard from './pages/ArtistDashboard'; 

import AdminDashboard from './pages/Admin/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#0F172A] text-slate-50 flex flex-col">
          
          <Navbar />

          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/register" element={<AdminRegister />} />
              <Route path="/register" element={<Register />} />

              <Route 
                path="/dashboard" 
                element={
                  <ArtistRoute>
                    <ArtistDashboard />  
                  </ArtistRoute>
                } 
              />

              <Route 
                path="/admin" 
                element={
                  <AdminRoute>
                    <AdminDashboard /> 
                  </AdminRoute>
                } 
              />

              <Route 
                path="/upload" 
                element={
                  <ArtistRoute>
                    <UploadArt />
                  </ArtistRoute>
                } 
              />

              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              

             
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>

          <Footer /> 
          
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;