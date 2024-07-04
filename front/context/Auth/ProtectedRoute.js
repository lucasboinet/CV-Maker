import axios from 'axiosconfig';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { Spinner } from 'reactstrap';
import { useAuthState } from './AuthContext';

const ProtectedRoute = ({ children }) => {
  const [{ user, loading }, dispatch] = useAuthState();
  const router = useRouter();

  useEffect(() => {
    dispatch({ type: 'REQUEST_LOGIN' });

    const isAuth = async () => {
      try {
        const res = await axios.get('/auth/isAuth');
        if (res && res.data) {
          dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
          return true;
        }
      } catch (error) {
        dispatch({ type: 'LOGIN_ERROR', error: error.response.data.message });
        return false;
      }
    };

    isAuth().then((response) => {
      !response && router.push('/login');
    });
  }, []);

  if (user === null || loading) {
    return <div className="spinner"><Spinner /></div>;
  }
  
  return children;
};

export default ProtectedRoute;
