import jwtDecode from 'jwt-decode';
import http from './httpService';

const apiEndpoint = '/login';
const tokenKey = 'token';

http.setJwt(getJwt());

async function login(username, password) {
    const { data: jwt } = await http.post(apiEndpoint, { username, password });
    localStorage.setItem(tokenKey, jwt);
}

function loginWithJwt(jwt) {
    localStorage.setItem(tokenKey, jwt);
}

function logout() {
    localStorage.removeItem(tokenKey);
}

function getCurrentUser() {
    try {
        const jwt = localStorage.getItem(tokenKey);
        // const jwt = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyIiwicm9sZXMiOiJVU0VSIiwiaWF0IjoxNTQzODYzMzMwLCJleHAiOjE1NDQ3MjczMzB9.1ZX9wAWVOxmqTtb4ZIyC_WepWoLBCiPTJgYw3P64LHfcZ4E3feHG4BzvZllwqa0GmSbvRzZHI_ExjLJBh6_gXw';
        return jwtDecode(jwt);
    } catch (e) {
        return null;
    }
}

function getJwt() {
    return localStorage.getItem(tokenKey);
}

export default {
    login,
    loginWithJwt,
    logout,
    getCurrentUser
};
