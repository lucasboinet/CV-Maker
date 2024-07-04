import { useRef, useState } from 'react';
import axios from '../axiosconfig';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuthState } from 'context/Auth';

import styles from '../styles/Register.module.scss';
import UnprotectedRoute from '@/context/Auth/UnprotectedRoute';

export default function Register() {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const confirmPassword = useRef();
  const firstname = useRef();
  const lastname = useRef();
  const [, dispatch] = useAuthState();
  const router = useRouter();

  const [errors, setErrors] = useState([]);

  const handleRegister = async (e) => {
    e.preventDefault();

    const messages = [];
    const payload = {
      username: username.current.value,
      email: email.current.value,
      password: password.current.value,
      confirmPassword: confirmPassword.current.value,
      firstname: firstname.current.value,
      lastname: lastname.current.value,
    };

    if (
      payload.firstname === '' ||
      payload.lastname === '' ||
      payload.username === '' ||
      payload.email === '' ||
      payload.password === '' ||
      payload.confirmPassword === ''
    ) {
      messages.push('Please fill all the fieldss');
    }

    if (
      payload.email !== '' &&
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(payload.email)
    ) {
      messages.push('Your email is not a valid format');
    }

    if (payload.password.length < 8) {
      messages.push('Your password should be at least 8 charaters long');
    }

    if (
      payload.password !== '' &&
      payload.password !== confirmPassword.current.value
    ) {
      messages.push('Your password and confirm password should be the same');
    }

    setErrors(messages);
    if (!messages.length > 0) {
      try {
        const res = await axios.post('/auth/register', payload);
        if (!res.error) {
          dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
          router.push('/login');
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <UnprotectedRoute>
      <div className={styles.registerContainer}>
        <h1>Register</h1>
        <div id="errors">
          {errors.length > 0 &&
            errors.map((error, index) => (
              <p key={index}>{JSON.stringify(error)}</p>
            ))}
        </div>

        <input type={'text'} placeholder={'First Name'} ref={firstname} />
        <input type={'text'} placeholder={'Last Name'} ref={lastname} />
        <input type={'text'} placeholder={'Username'} ref={username} />
        <input type={'text'} placeholder={'Email'} ref={email} />
        <input type={'password'} placeholder={'Password'} ref={password} />
        <input
          type={'password'}
          placeholder={'Confirm Password'}
          ref={confirmPassword}
        />

        <button onClick={handleRegister}> Register </button>
        <Link href="/login">
          <button>Login</button>
        </Link>
      </div>
    </UnprotectedRoute>
  );
}
