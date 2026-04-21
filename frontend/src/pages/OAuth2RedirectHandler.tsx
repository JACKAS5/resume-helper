import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../store';
import { setToken, fetchCurrentUser } from '../store/slices/authSlice';

const OAuth2RedirectHandler: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      dispatch(setToken(token));
      dispatch(fetchCurrentUser()).then(() => {
        navigate('/');
      });
    } else {
      navigate('/login');
    }
  }, [location, navigate, dispatch]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );
};

export default OAuth2RedirectHandler;
