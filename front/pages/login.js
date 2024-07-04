import { useRef } from 'react';
import Link from 'next/link';
import { login, useAuthState } from 'context/Auth';
import { useRouter } from 'next/router';
import styles from '../styles/Login.module.scss';
import UnprotectedRoute from '@/context/Auth/UnprotectedRoute';

export default function Login() {
  const identifier = useRef();
  const password = useRef();
  const router = useRouter();
  const [{errorMessage}, dispatch] = useAuthState();

    const handleLogin = async (e) => {
        e.preventDefault();
        const payload = { auth: identifier.current.value, password: password.current.value };
        try {
            const res = await login(dispatch, payload);
            if (errorMessage) {
            }
            if (!res) return;
            router.push('/');
        } catch(err) {
            console.error(err);
        }
    }

    return (
        <UnprotectedRoute>
            <div className={styles.loginContainer}>
              <h1>Login</h1>
              {errorMessage && <p>{errorMessage}</p>}
              <input
                type={'text'}
                id={'auth'}
                placeholder={'Email or Username'}
                ref={identifier}
              />
              <label htmlFor="auth">Email or Username</label>
              <input type={'password'} placeholder={'Password'} ref={password} />
              <label htmlFor="auth">Password</label>
              <button onClick={handleLogin}>Login</button>
              <Link href="/register">
                <button>Register</button>
              </Link>
            </div>
        </UnprotectedRoute>
      );
  };
