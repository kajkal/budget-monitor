import jwtDecode from 'jwt-decode';
import localStorageService from './localStorageService';
import http from './httpService';


const apiEndpoint = '/login';

async function login(username, password) {
    const { data: jwt } = await http.post(apiEndpoint, { username, password });
    if (jwt) await localStorageService.setToken(jwt.token);
}

async function logout() {
    await localStorageService.removeToken();
    http.setJwt(null);
}

async function getCurrentUser() {
    try {
        const jwt = await localStorageService.getToken();
        return jwtDecode(jwt);
    } catch (e) {
        return null;
    }
}

export default {
    login,
    logout,
    getCurrentUser
};
