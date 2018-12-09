import React from 'react';
import Joi from 'joi-browser';
import Form from '../common/form/Form';
import auth from '../../services/authService';
import { register } from '../../services/entities-services/userService';
import { translateErrorMessage } from '../../services/errorMessageTranslator';

class RegisterForm extends Form {
    state = {
        data: {
            username: '',
            email: '',
            password: '',
            currency: ''
        },
        errors: {}
    };

    schema = {
        username: Joi.string()
            .required()
            .min(3)
            .max(30)
            .regex(/^[a-zA-Z0-9]+([_ -]?[a-zA-Z0-9])*$/, 'alphanumeric characters with exception of \'-\' and \'_\'')
            .label('Username'),
        email: Joi.string()
            .required()
            .email({ minDomainAtoms: 2 })
            .label('Email address'),
        password: Joi.string()
            .required()
            .min(6)
            .max(30)
            .label('Password'),
        currency: Joi.string()
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
            <div className='form'>

                <h1>Register</h1>
                <form onSubmit={this.handleSubmit}>
                    {this.renderTextInput('username', 'Username')}
                    {this.renderTextInput('email', 'Email address')}
                    {this.renderPasswordInput('password', 'Password',)}
                    {/*TODO currency dropdown?*/}
                    {this.renderTextInput('currency', 'Basic currency')}
                    {this.renderGeneralErrorPanel()}
                    {this.renderButton('Register')}
                </form>
            </div>
        );
    }
}

export default RegisterForm;
