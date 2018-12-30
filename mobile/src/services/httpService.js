import axios from 'axios';
import alertService from './alertService';


axios.defaults.baseURL = 'http://192.168.56.1:8080/api';

axios.interceptors.response.use(null, error => {
    const expectedError = error.response && error.response.status >= 400 && error.response.status < 500;

    if (!expectedError) {
        console.log('unexpected error!', error);
        alertService.error('An unexpected error occurred');
    }

    return Promise.reject(error);
});

function setJwt(jwt) {
    axios.defaults.headers.common['Authorization'] = jwt;
    console.log('JWT in http service set: ', jwt);
}

export default {
    get: axios.get,
    post: axios.post,
    put: axios.put,
    delete: axios.delete,
    setJwt
};
