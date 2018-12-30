import alertService from './alertService';


const ACCESS_DENIED = 'Access Denied';

const LOGIN_ERROR_UNAUTHORIZED = 'login.error.unauthorized';
const LOGIN_ERROR_BAD_CREDENTIAL = 'login.error.badCredentials';

const ENTRY_ERROR_UNAUTHORIZED = 'entryData.error.unauthorised';
const ENTRY_ERROR_ENTRY_NOT_FOUND = 'entryData.error.entryNotFound';
const ENTRY_ERROR_BAD_REQUEST = 'entryData.error.badRequest';
const ENTRY_UNKNOWN_ERROR = 'entryData.error.unknownError';


const GENERAL_ERRORS_MAP = new Map([
    [ACCESS_DENIED, {
        relatedFields: [],
        message: 'Access Denied.',
    }],

    [LOGIN_ERROR_UNAUTHORIZED, {
        relatedFields: [],
        message: 'You must be logged in first.',
    }],

    [LOGIN_ERROR_BAD_CREDENTIAL, {
        relatedFields: ['username', 'password'],
        message: 'Bad username or password.',
    }],

    [ENTRY_ERROR_UNAUTHORIZED, {
        relatedFields: [],
        message: 'You are not authorized to perform that operation.',
    }],

    [ENTRY_ERROR_ENTRY_NOT_FOUND, {
        relatedFields: [],
        message: 'Entry not found.',
    }],

    [ENTRY_ERROR_BAD_REQUEST, {
        relatedFields: [],
        message: 'Bad request format.',
    }],

    [ENTRY_UNKNOWN_ERROR, {
        relatedFields: [],
        message: 'Unknown error occurred.',
    }],
]);


function getGeneralErrorMessage(message) {
    const errors = {};
    const error = GENERAL_ERRORS_MAP.get(message);
    if (error) {
        alertService.error(error.message);
        error.relatedFields.forEach(field => errors[field] = null);
    }
    return errors;
}

export function translateErrorMessage(message) {
    return getGeneralErrorMessage(message);
}
