import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import OAuth2RedirectHandler from './OAuth2RedirectHandler.jsx';
import AdminDashboard from "./pages/AdminDashboard";
import ListBacaan from "./pages/ListBacaan";
import DetailBacaan from './pages/DetailBacaan';
import AchievementInventory from './pages/AchievementInventory';
import DailyMissions from './pages/DailyMissions';
import AdminQuiz from "./pages/AdminQuiz";
import QuizPage from "./pages/QuizPage";

function App() {
    const location = useLocation();
    const isAdminPage = location.pathname.startsWith('/admin');

    return (
        <div className="min-h-screen w-full bg-main text-white flex flex-col overflow-x-hidden font-sans">
            {!isAdminPage && <Navbar />}
            <main className="grow pb-20 overflow-y-auto">
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/listBacaan" element={<ListBacaan />} />
                    <Route path="/bacaan/:id" element={<DetailBacaan />} />
                    <Route path="/admin/quiz" element={<AdminQuiz />} />
                    <Route path="/quiz/:id" element={<QuizPage />} />
                    <Route path="/achievements" element={<AchievementInventory />} />
                    <Route path="/missions" element={<DailyMissions />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;