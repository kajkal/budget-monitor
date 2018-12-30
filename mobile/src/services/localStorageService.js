import { AsyncStorage } from 'react-native';
import http from './httpService';


const tokenKey = 'token';
const tokenType = 'Bearer';
let inMemoryToken = null;

function setInMemoryToken(token) {
    inMemoryToken = token;
    const jwt = token ? `${tokenType} ${token}` : null;
    http.setJwt(jwt);
}

async function getToken() {
    console.log('getToken, inMemory: ', inMemoryToken);

    if (inMemoryToken) {
        console.log('returning token from memory', inMemoryToken);
        return inMemoryToken;
    }

    try {
        const token = await AsyncStorage.getItem(tokenKey);
        setInMemoryToken(token);
        console.log('returning token from AsyncStorage', inMemoryToken);
        return token;
    } catch (e) {
        console.log('Set token finished with errors.');
        return null;
    }
}


async function setToken(token) {
    if (inMemoryToken !== token) {
        console.log('set token in AsyncStorage');
        setInMemoryToken(token);
        try {
            await AsyncStorage.setItem(tokenKey, token);
        } catch (e) {
            console.log('Set token finished with errors.');
        }
    }
}

async function removeToken() {
    try {
        await AsyncStorage.removeItem(tokenKey);
        setInMemoryToken(null);
    } catch (e) {
        console.log('Remove token finished with errors.');
    }
}

export default {
    getToken,
    setToken,
    removeToken,
};
