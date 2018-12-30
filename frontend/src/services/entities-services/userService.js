import http from '../httpService';
import { CURRENCY, EMAIL, PASSWORD, USERNAME } from '../../config/fieldNames';

const apiEndpoint = '/users';

// function userUrl(userId) {
//     return `${apiEndpoint}/${userId}`;
// }

function parseUser(user) {
    return ({
        username: user[USERNAME].trim(),
        email: user[EMAIL].trim(),
        password: user[PASSWORD].trim(),
        currency: user[CURRENCY],
    });
}


export function register(user) {
    return http.post(apiEndpoint, parseUser(user));
}
