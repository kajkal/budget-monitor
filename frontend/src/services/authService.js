import jwtDecode from 'jwt-decode';
import http from './httpService';

const apiEndpoint = '/login';
const tokenType = 'Bearer';
const tokenKey = 'token';

http.setJwt(getJwtHeader());

async function login(username, password) {
    const { data: jwt } = await http.post(apiEndpoint, { username, password });
    localStorage.setItem(tokenKey, jwt.token);
}

function loginWithJwt(jwt) {
    localStorage.setItem(tokenKey, jwt.token);
}

function logout() {
    localStorage.removeItem(tokenKey);
}

function getCurrentUser() {
    try {
        const jwt = localStorage.getItem(tokenKey);
        return jwtDecode(jwt);
    } catch (e) {
        return null;
    }
}

function getJwtHeader() {
    const jwt = localStorage.getItem(tokenKey);
    console.log('getJwtHeader: ',  jwt && `${tokenType} ${jwt}`);
    return jwt && `${tokenType} ${jwt}`;
}

export default {
    login,
    loginWithJwt,
    logout,
    getCurrentUser
};
