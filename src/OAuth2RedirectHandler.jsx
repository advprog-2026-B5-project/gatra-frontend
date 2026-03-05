import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const OAuth2RedirectHandler = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            try {
                // DECODE TOKEN JWT UNTUK MENGAMBIL USER ID
                const payloadBase64 = token.split('.')[1];
                const decodedJson = atob(payloadBase64);
                const payload = JSON.parse(decodedJson);

                // Simpan Token dan User ID (dari dalam token) ke brankas browser
                localStorage.setItem('token', token);
                localStorage.setItem('userId', payload.userId);

                // Sukses! Lempar ke halaman profil
                navigate('/profile');
            } catch (error) {
                console.error('Gagal membaca token:', error);
                navigate('/login?error=InvalidToken');
            }
        } else {
            // Jika token tidak ada, kembalikan ke login
            navigate('/login?error=GoogleLoginFailed');
        }
    }, [navigate, searchParams]);

    return (
        <div className="min-h-screen bg-[#070913] flex items-center justify-center">
            <div className="text-xl font-semibold text-blue-400 animate-pulse tracking-wide">
                Mengamankan Sesi Login Anda...
            </div>
        </div>
    );
};

export default OAuth2RedirectHandler;