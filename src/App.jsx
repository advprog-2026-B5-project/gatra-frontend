import { useState, useEffect } from 'react';
import { login, register, getAllUsers } from './api/auth';

function App() {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '', displayName: '' });
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [userData, setUserData] = useState([]); 
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUserData([]);
  };

  useEffect(() => {
    if (token) {
      setLoading(true);
      getAllUsers(token)
        .then(data => {
          setUserData(data); 
        })
        .catch(err => {
          console.error("Gagal load data: ", err);
          handleLogout();
        })
        .finally(() => setLoading(false));
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await register(formData.username, formData.password, formData.displayName);
        alert("Berhasil daftar! Silakan login.");
        setIsRegister(false);
      } else {
        const data = await login(formData.username, formData.password);
        localStorage.setItem('token', data.token);
        setToken(data.token);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  if (!token) {
    return (
      <div style={{ padding: '20px'}}>
        <h2>{isRegister ? 'Register' : 'Login'}</h2>
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <input 
                type="text" 
                placeholder="Nama lengkap" 
                required 
                style={{ marginBottom: '10px', display: 'block' }}
                onChange={(e) => setFormData({...formData, displayName: e.target.value})} 
              />
            </>
          )}
          <input 
            type="text" 
            placeholder="Username" 
            required 
            style={{ marginBottom: '10px', display: 'block' }}
            onChange={(e) => setFormData({...formData, username: e.target.value})} 
          />
          <input 
            type="password" 
            placeholder="Password" 
            required 
            style={{ marginBottom: '10px', display: 'block' }}
            onChange={(e) => setFormData({...formData, password: e.target.value})} 
          />
          <button type="submit" style={{ marginRight: '10px' }}>
            {isRegister ? 'Daftar' : 'Masuk'}
          </button>
        </form>
        <p>
          {isRegister ? 'Sudah punya akun?' : 'Belum punya akun?'} 
          <button onClick={() => setIsRegister(!isRegister)} style={{ marginLeft: '5px' }}>
            {isRegister ? 'Login di sini' : 'Daftar di sini'}
          </button>
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={handleLogout} style={{ color: 'red', marginBottom: '20px' }}>Logout</button>
      <hr />
      
      {loading ? (
        <p>Sedang mengambil data.</p>
      ) : (
        <div style={{ marginTop: '20px' }}>
          {Array.isArray(userData) && userData.length > 0 ? (
            userData.map((user, index) => (
              <div key={user.id || index} style={{ marginBottom: '15px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
                <strong>Username:</strong> {user.username} <br />
                <strong>Nama:</strong> {user.displayName || '-'} <br />
                <strong>Role:</strong> {user.role} <br />
                <strong>ID:</strong> {user.id}
              </div>
            ))
          ) : (
            <p>Tidak ada data user.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;