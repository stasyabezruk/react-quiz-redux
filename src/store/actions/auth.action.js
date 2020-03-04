import axios from 'axios';
import {AUTH_LOGOUT, AUTH_SUCCESS} from "./actionTypes";

export const authAction = (email, password, isLogin) => {
    return async dispatch => {
        const authData = {
          email,
          password,
          returnSecureToken: true
        };

        let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBS_xyF_kw4Kn_vcsrequFA5KLULLpCjnE'
        if (isLogin) {
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBS_xyF_kw4Kn_vcsrequFA5KLULLpCjnE';
        }

        const response = await axios.post(url, authData);
        const data = response.data;

        const expiredDate = new Date(new Date().getTime() + data.expiresIn * 1000)

        localStorage.setItem('token', data.idToken);
        localStorage.setItem('userId', data.localId);
        localStorage.setItem('expiredDate', expiredDate);

        dispatch(authSuccess(data.idToken));
        dispatch(autoLogout(data.expiresIn));
    }
};

const autoLogout = time => {
    return dispatch => {
        setTimeout(() => {
           dispatch(logout())
        }, time *1000);
    }
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('expiredDate');

    return {
        type: AUTH_LOGOUT
    }
};

const authSuccess = token => {
    return {
        type: AUTH_SUCCESS,
        token
    }
};

export const autoLoginAction = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        if (!token) {
            dispatch(logout())
        } else {
            const expiredDate = new Date(localStorage.getItem('expiredDate'));
            if (expiredDate <= new Date()) {
                dispatch(logout());
            } else {
                dispatch(authSuccess(token));
                dispatch(autoLogout((expiredDate.getTime() - new Date().getTime()) / 1000));
            }
        }
    }
};

