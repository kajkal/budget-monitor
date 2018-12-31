import React from 'react';
import Joi from 'joi-browser';
import Paper from '@material-ui/core/Paper/Paper';
import Form from '../common/forms/Form';
import auth from '../../services/authService';
import { register } from '../../services/entities-services/userService';
import { translateErrorMessage } from '../../services/errorMessageService';
import {USERNAME, EMAIL, PASSWORD, CURRENCY} from '../../config/fieldNames';
import { getCurrencies } from '../../services/entities-services/currencyService';
import { alertService } from '../../services/alertService';
import { Redirect } from 'react-router-dom';


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
            .regex(/^[a-zA-Z0-9]+([_-]?[a-zA-Z0-9])*$/, 'alphanumeric characters with exception of \'-\' and \'_\'')
            .label('Username'),
        [EMAIL]: Joi.string()
            .required()
            .email({ minDomainAtoms: 2 })
            .label('Email address'),
        [PASSWORD]: Joi.string()
            .required()
            .min(6)
            .max(30)
            .regex(/(?=.*?[A-Z])/, 'at least one upper case letter')
            // .regex(/(?=.*?[#?!@$%^&*-])/, 'at least one special character')
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

            auth.loginWithJwt(response.data);
            window.location = '/';
            alertService.success('You have successfully registered and logged in.');
        } catch (e) {
            if (e.response && [400, 401].includes(e.response.status)) {
                const errors = translateErrorMessage(e.response.data.message);
                this.setState({ errors });
            }
        }
    };

    render() {
        if (auth.getCurrentUser()) return <Redirect to='/' />;

        const options = getCurrencies();
        return (
            <Paper className='form-container'>

                <form autoComplete='on' onKeyDown={this.onEnterDown}>
                    <header className='form-header'>
                        Register
                    </header>

                    <div className='form-content register-form'>
                        {this.renderTextInput([USERNAME], 'Username', {}, {className: 'username-input', focus: true})}
                        {this.renderTextInput([EMAIL], 'Email address', {}, {className: 'email-input'})}
                        {this.renderPasswordInput([PASSWORD], 'Password', {}, {className: 'password-input'})}
                        {this.renderSelectInput([CURRENCY], 'Basic currency', {options}, {className: 'currency-input'})}
                    </div>

                    <footer>
                        {this.renderSubmitButton('Register')}
                    </footer>
                </form>

            </Paper>
        );
    }
}

export default RegisterForm;
