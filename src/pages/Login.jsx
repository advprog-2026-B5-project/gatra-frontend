import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ identifier: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleManualLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Gagal login, periksa kembali data Anda.');
            }

            const data = await response.json();
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('role', data.role);
            if(data.role === 'ROLE_ADMIN'){
                navigate('/admin/dashboard');
            } else{
                navigate('/profile');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    };

    return (
        <div className="flex-1 w-full relative overflow-hidden flex flex-col">
            {/* Background Glow Effect */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-200 h-100 bg-purple-600/20 blur-[120px] rounded-t-full pointer-events-none"></div>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center p-4 relative z-10 pt-10">
                <div className="bg-[#131627] p-8 md:p-10 rounded-3xl w-full max-w-100 shadow-2xl border border-gray-800/60">
                    <h2 className="text-2xl font-bold text-center mb-8 tracking-wide">Login</h2>

                    {error && <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-xl mb-4 text-sm text-center">{error}</div>}

                    <form onSubmit={handleManualLogin} className="space-y-5">
                        <div>
                            <label className="block text-xs text-gray-400 mb-1.5 font-medium ml-1">Email/nomor hp</label>
                            <input
                                type="text" required placeholder="Type here"
                                value={formData.identifier}
                                onChange={(e) => setFormData({...formData, identifier: e.target.value})}
                                className="w-full bg-[#1E2235] border border-transparent focus:border-blue-500 rounded-xl p-3 text-sm outline-none text-white placeholder-gray-500 transition"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1.5 font-medium ml-1">Password</label>
                            <input
                                type="password" required placeholder="Type here"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                className="w-full bg-[#1E2235] border border-transparent focus:border-blue-500 rounded-xl p-3 text-sm outline-none text-white placeholder-gray-500 transition"
                            />
                        </div>

                        <div className="flex justify-start">
                            <a href="#" className="text-xs text-blue-400 hover:text-blue-300 ml-1">Forgot password?</a>
                        </div>

                        <button
                            type="submit" disabled={isLoading}
                            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 mt-2"
                        >
                            {isLoading ? 'Memproses...' : 'Login'}
                        </button>
                    </form>

                    {/* Google Button */}
                    <button
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-3 bg-[#E8EAED] text-gray-800 py-3 rounded-xl hover:bg-white transition font-semibold mt-4"
                    >
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                        Sign in with Google
                    </button>

                    <p className="mt-8 text-center text-xs text-gray-400">
                        Don&#39;t have an account? <br/>
                        <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium">Register</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;