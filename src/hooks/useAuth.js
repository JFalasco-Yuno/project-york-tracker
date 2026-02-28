import { useRef, useState, useCallback } from 'react';
import { useGoogleLogin } from '@react-oauth/google';

export function useAuth() {
  const tokenRef = useRef(null);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState(null);

  const handleSuccess = useCallback(async (tokenResponse) => {
    tokenRef.current = tokenResponse.access_token;
    try {
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch user info');
      const data = await res.json();
      setUser(data);
      setIsAuthenticated(true);
      setAuthError(null);
    } catch {
      tokenRef.current = null;
      setAuthError('Signed in but could not load user profile. Please try again.');
    }
  }, []);

  const login = useGoogleLogin({
    onSuccess: handleSuccess,
    onError: () => setAuthError('Google sign-in failed. Please try again.'),
    scope: 'https://www.googleapis.com/auth/spreadsheets openid email profile',
  });

  const logout = useCallback(() => {
    tokenRef.current = null;
    setUser(null);
    setIsAuthenticated(false);
    setAuthError(null);
  }, []);

  return { isAuthenticated, user, login, logout, tokenRef, authError };
}
