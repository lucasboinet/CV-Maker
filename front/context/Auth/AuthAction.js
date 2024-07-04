import axios from 'axiosconfig';

export async function login(dispatch, payload) {
    try {
        dispatch({ type: "REQUEST_LOGIN" });
        const res = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/login`, payload);
        if (res.data.user) {
            dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
            return res.data.user;
        }
       
        dispatch({ type: 'LOGIN_ERROR', error: res.data.message });
        return;
    } catch(err) {
        dispatch({ type: 'LOGIN_ERROR', error: err.response.data.message });
    }
}

export async function logout(dispatch) {
    dispatch({ type: 'LOGOUT' });
  }