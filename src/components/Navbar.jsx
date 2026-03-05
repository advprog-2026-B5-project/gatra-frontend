import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import Button from '../components/Button';

const Navbar = ({ isLoggedIn }) => {
  const navigate = useNavigate();

  return (
    <nav className="flex justify-between items-center px-12 py-6 bg-dark-sky-900 sticky top-0 z-50">
      <div className="flex items-center">
        <button onClick={() => navigate('/')} className="focus:outline-none">
          <Logo variant="full" className="h-10 w-auto object-contain" />
        </button>
      </div>

      <div className="hidden md:flex gap-8 text-gray-300">
        <a href="#" className="font-sans hover:text-white transition">Beranda</a>
        <a href="#" className="hover:text-white transition">Fitur</a>
        <a href="#" className="hover:text-white transition">Tentang</a>
      </div>

      <div className="flex items-center">
        {isLoggedIn ? (
            <button 
                onClick={() => navigate('/profile')}
                className="flex items-center justify-center w-12 h-10 rounded-xl text-blue-400 hover:text-white transition-all duration-300 shadow-lg shadow-blue-500/5 hover:scale-110 group"
                title="Lihat Profil"
            >
              <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-9 w-9" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </button>
        ) : (
          <Button 
            onClick={() => navigate('/login')} 
            variant="primary" 
            className="w-fit"
          >
            Masuk
          </Button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;