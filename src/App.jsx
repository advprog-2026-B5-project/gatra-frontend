import { useState, useEffect } from 'react'; 
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const location = useLocation();

  useEffect(() => {
    const currentToken = localStorage.getItem('token') || '';
    setToken(currentToken);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setToken('');
  };
  
  return (
    <div className="min-h-screen w-full bg-main text-white flex flex-col">
      <Navbar onLogout={handleLogout} isLoggedIn={!!token} />
      
      <main className="flex-grow pb-20 overflow-y-auto">
        <Routes>
          <Route path="/" element={<LandingPage />} />

          {/* <Route 
            path="/login" 
            element={!token ? <LoginPage /> : <Navigate to="/" />} 
          />

          <Route path="/register" element={<RegisterPage />} /> */}
        </Routes>
      </main>
    </div>
  );
}

export default App;