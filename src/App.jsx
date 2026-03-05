import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import OAuth2RedirectHandler from './OAuth2RedirectHandler.jsx';

function App() {
  return (
    <div className="min-h-screen w-full bg-main text-white flex flex-col overflow-x-hidden font-sans">
      <Navbar />

      <main className="grow pb-20 overflow-y-auto">
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;