import { useState } from 'react'; 
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setToken('');
  };
  
  return (
    <div className="min-h-screen w-full bg-main text-white flex flex-col">
      <Navbar onLogout={handleLogout} isLoggedIn={!!token} />
      
      <main className="grow pb-20 overflow-y-auto">
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