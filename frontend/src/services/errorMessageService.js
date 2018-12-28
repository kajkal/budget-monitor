import {EMAIL, PASSWORD, USERNAME} from '../config/fieldNames';
import {alertService} from './alertService';

const ACCESS_DENIED = 'Access Denied';

const LOGIN_ERROR_UNAUTHORIZED = 'login.error.unauthorized';
const LOGIN_ERROR_BAD_CREDENTIAL = 'login.error.badCredentials';

const REGISTER_ERROR_USERNAME_EXISTS = 'register.error.usernameExists';
const REGISTER_ERROR_EMAIL_EXISTS = 'register.error.emailExists';
const REGISTER_ERROR_BAD_REQUEST = 'userData.error.badRequest';
const REGISTER_UNKNOWN_ERROR = 'userData.error.unknownError';

const ENTRY_ERROR_UNAUTHORIZED = 'entryData.error.unauthorised';
const ENTRY_ERROR_ENTRY_NOT_FOUND = 'entryData.error.entryNotFound';
const ENTRY_ERROR_BAD_REQUEST = 'entryData.error.badRequest';
const ENTRY_UNKNOWN_ERROR = 'entryData.error.unknownError';

const CATEGORY_ERROR_UNAUTHORIZED = 'categoryData.error.unauthorised';
const CATEGORY_ERROR_CATEGORY_NOT_FOUND = 'categoryData.error.entryNotFound';
const CATEGORY_ERROR_BAD_REQUEST = 'categoryData.error.badRequest';
const CATEGORY_UNKNOWN_ERROR = 'categoryData.error.unknownError';


const INPUT_ERRORS_MAP = new Map([
    [REGISTER_ERROR_USERNAME_EXISTS, {
        field: USERNAME,
        message: 'Sorry, that username already exists.',
    }],

    [REGISTER_ERROR_EMAIL_EXISTS, {
        field: EMAIL,
        message: 'Sorry, that email already exists.',
    }],
]);

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
        relatedFields: [USERNAME, PASSWORD],
        message: 'Bad username or password.',
    }],

    [REGISTER_ERROR_BAD_REQUEST, {
        relatedFields: [],
        message: 'Bad request format.',
    }],

    [REGISTER_UNKNOWN_ERROR, {
        relatedFields: [],
        message: 'Unknown error occurred.',
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

    [CATEGORY_ERROR_UNAUTHORIZED, {
        relatedFields: [],
        message: 'You are not authorized to perform that operation.',
    }],

    [CATEGORY_ERROR_CATEGORY_NOT_FOUND, {
        relatedFields: [],
        message: 'Category not found.',
    }],

    [CATEGORY_ERROR_BAD_REQUEST, {
        relatedFields: [],
        message: 'Bad request format.',
    }],

    [CATEGORY_UNKNOWN_ERROR, {
        relatedFields: [],
        message: 'Unknown error occurred.',
    }],
]);

function getInputErrorMessages(message) {
    const errors = {};

    const validationErrors = message.match(/notValid\[(.*)]/);
    if (validationErrors && validationErrors[1]) {
        const invalidInputs = validationErrors[1].split(',');
        invalidInputs.forEach(input => errors[input] = 'Provided inputs are not valid.');
    } else {
        const error = INPUT_ERRORS_MAP.get(message);
        if (error) errors[error.field] = error.message;
    }

    return errors;
}

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
    const inputErrors = getInputErrorMessages(message);
    const generalError = getGeneralErrorMessage(message);
    return { ...inputErrors, ...generalError };
}
