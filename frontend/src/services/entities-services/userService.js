import http from '../httpService';

const apiEndpoint = '/users';

export function register(user) {
    return http.post(apiEndpoint, {
        username: user.username,
        email: user.email,
        password: user.password,
        currency: user.currency
    });
}
