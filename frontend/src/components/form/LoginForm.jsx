import React from 'react';
import Joi from 'joi-browser';
import Form from '../common/form/Form';
import auth from '../../services/authService';

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

            // this.props.history.push('/');
            const {state} = this.props.location;
            window.location = state ? state.from.pathname : '/';
        } catch (e) {
            if (e.response && e.response.status === 400) {
                const errors = { ...this.state.errors };
                errors.username = e.response.data;
                this.setState({ errors });
            }
        }
    };

    render() {
        // if (auth.getCurrentUser()) return <Redirect to='/' />;

        return (
            <div>
                <h1>Login</h1>
                <form onSubmit={this.handleSubmit}>
                    {this.renderTextInput('username', 'Username')}
                    {this.renderPasswordInput('password', 'Password')}
                    {this.renderButton('Login')}
                </form>
            </div>
        );
    }
}

export default LoginForm;