import { EMAIL, PASSWORD, USERNAME } from '../config/fieldNames';
import { alertService } from './alertService';

const ACCESS_DENIED = 'Access Denied';
const LOGIN_ERROR_UNAUTHORIZED = 'login.error.unauthorized';
const LOGIN_ERROR_BAD_CREDENTIAL = 'login.error.badCredentials';
const REGISTER_ERROR_USERNAME_EXISTS = 'register.error.usernameExists';
const REGISTER_ERROR_EMAIL_EXISTS = 'register.error.emailExists';
const REGISTER_UNKNOWN_ERROR = 'userData.error.badRequest';

const INPUT_ERRORS_MAP = new Map([
    [REGISTER_ERROR_USERNAME_EXISTS, {
        field: USERNAME,
        message: 'Sorry, that username already exists.'
    }],

    [REGISTER_ERROR_EMAIL_EXISTS, {
        field: EMAIL,
        message: 'Sorry, that email already exists.'
    }],
]);

const GENERAL_ERRORS_MAP = new Map([
    [ACCESS_DENIED, {
        relatedFields: [],
        message: 'Access Denied.'
    }],

    [LOGIN_ERROR_UNAUTHORIZED, {
        relatedFields: [],
        message: 'You must be logged in first.'
    }],

    [LOGIN_ERROR_BAD_CREDENTIAL, {
        relatedFields: [USERNAME, PASSWORD],
        message: 'Bad username or password.'
    }],
]);

function getInputErrorMessages(message) {
    const errors = {};

    const validationErrors = message.match(/notValid\[(.*)]/);
    if (validationErrors && validationErrors[1]) {
        console.log('validationErrors: ', validationErrors[1]);
        const invalidInputs = validationErrors[1].split(',');
        console.log('invalidInputs: ', invalidInputs);
        invalidInputs.forEach(input => errors[input] = 'Validation error.');
    } else {
        const error = INPUT_ERRORS_MAP.get(message);
        console.log('error: ', error);
        if (error)
            errors[error.field] = error.message;
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
    console.log('inputErrors: ', inputErrors);
    console.log('generalError: ', generalError);
    return { ...inputErrors, ...generalError };
}
