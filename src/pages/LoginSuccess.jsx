import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

const LoginSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [message, setMessage] = useState('Completing Google login...');

  useEffect(() => {
    const completeOAuthLogin = async () => {
      const token = searchParams.get('token');
      const error = searchParams.get('error');

      if (error) {
        setMessage('Google login failed. Please try again.');
        setTimeout(() => navigate('/', { replace: true }), 1200);
        return;
      }

      if (!token) {
        setMessage('Login token is missing. Please try again.');
        setTimeout(() => navigate('/', { replace: true }), 1200);
        return;
      }

      try {
        console.log('[AUTH] Google OAuth completing, token received');
        
        localStorage.setItem('token', token);
        localStorage.setItem('agri_token', token);

        const res = await api.get('/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = res.data?.data?.user;
        if (!user) throw new Error('User not found in login response.');

        login(token, user);
        setMessage('Login successful. Redirecting...');
        setTimeout(() => navigate('/', { replace: true }), 600);
      } catch (err) {
        console.error('[AUTH] Google OAuth completion error:', err.message);
        setMessage('Unable to complete login. Please try again.');
        setTimeout(() => navigate('/', { replace: true }), 1200);
      }
    };

    completeOAuthLogin();
  }, [login, navigate, searchParams]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center px-4">
      <p className="text-sm font-medium text-gray-600">{message}</p>
    </div>
  );
};

export default LoginSuccess;
