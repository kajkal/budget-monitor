import React from 'react';
import Joi from 'joi-browser';
import Form from '../common/form/Form';
import auth from '../../services/authService';
import { register } from '../../services/entities-services/userService';
import { translateErrorMessage } from '../../services/errorMessageService';
import {USERNAME, EMAIL, PASSWORD, CURRENCY} from '../../config/fieldNames';
import Paper from '@material-ui/core/Paper/Paper';
import { getCurrencies } from '../../services/entities-services/currencyService';

class RegisterForm extends Form {
    state = {
        data: {
            [USERNAME]: '',
            [EMAIL]: '',
            [PASSWORD]: '',
            [CURRENCY]: ''
        },
        errors: {}
    };

    schema = {
        [USERNAME]: Joi.string()
            .required()
            .min(3)
            .max(30)
            .regex(/^[a-zA-Z0-9]+([_ -]?[a-zA-Z0-9])*$/, 'alphanumeric characters with exception of \'-\' and \'_\'')
            .label('Username'),
        [EMAIL]: Joi.string()
            .required()
            .email({ minDomainAtoms: 2 })
            .label('Email address'),
        [PASSWORD]: Joi.string()
            .required()
            .min(6)
            .max(30)
            .label('Password'),
        [CURRENCY]: Joi.string()
            .required()
            .alphanum()
            .min(3)
            .max(3)
            .regex(/^[A-Z]+$/, 'alpha')
            .label('Basic currency')
    };

    doSubmit = async () => {
        try {
            const response = await register(this.state.data);

            console.log('response from server: ', response);

            auth.loginWithJwt(response.data);
            console.log('register with success!');
            window.location = '/';
        } catch (e) {
            if (e.response && [400, 401].includes(e.response.status)) {
                console.log('messageKey: ', e.response.data.message);
                const errors = translateErrorMessage(e.response.data.message);
                console.log('translated errors: ', errors);
                this.setState({ errors });
            }
        }
    };

    render() {
        return (
            <Paper className='form-container'>

                <h1>Register</h1>
                <form onSubmit={this.handleSubmit} autoComplete='on'>
                    {this.renderTextInput(USERNAME, 'Username', true)}
                    {this.renderTextInput(EMAIL, 'Email address')}
                    {this.renderPasswordInput(PASSWORD, 'Password',)}
                    {this.renderSelectInput(CURRENCY, 'Basic currency', getCurrencies())}

                    {this.renderButton('Register')}
                </form>

            </Paper>
        );
    }
}

export default RegisterForm;
