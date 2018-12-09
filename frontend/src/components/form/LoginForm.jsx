import React from 'react';
import Joi from 'joi-browser';
import { Redirect } from 'react-router-dom';
import Form from '../common/form/Form';
import auth from '../../services/authService';
import { translateErrorMessage } from '../../services/errorMessageTranslator';

class LoginForm extends Form {
    state = {
        data: {
            username: '',
            password: ''
        },
        errors: {}
    };

    schema = {
        username: Joi.string()
            .required()
            .label('Username'),
        password: Joi.string()
            .required()
            .label('Password')
    };

    doSubmit = async () => {
        try {
            console.log('send request to login');
            const { data } = this.state;
            await auth.login(data.username, data.password);

            console.log('login with success!');

            const {state} = this.props.location;
            window.location = state ? state.from.pathname : '/';
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
        if (auth.getCurrentUser()) return <Redirect to='/' />;

        return (
            <div className='form'>

                <h1>Login</h1>
                <form onSubmit={this.handleSubmit}>
                    {this.renderTextInput('username', 'Username')}
                    {this.renderPasswordInput('password', 'Password')}
                    {this.renderGeneralErrorPanel()}
                    {this.renderButton('Login')}
                </form>
            </div>
        );
    }
}

export default LoginForm;