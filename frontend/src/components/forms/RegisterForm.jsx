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

            auth.loginWithJwt(response.data);
            window.location = '/';
            alertService.success('You have successfully registered and logged in.');
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

                <form onSubmit={this.handleSubmit} autoComplete='on'>
                    <header>
                        Register
                    </header>

                    <div className='form-content register-form'>
                        {this.renderTextInput([USERNAME], 'Username', 'TODO', true)}
                        {this.renderTextInput([EMAIL], 'Email address', 'TODO')}
                        {this.renderPasswordInput([PASSWORD], 'Password', 'TODO')}
                        {this.renderSelectInput([CURRENCY], 'Basic currency', getCurrencies(), 'TODO')}
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
