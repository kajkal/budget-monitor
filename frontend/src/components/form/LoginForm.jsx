import React from 'react';
import Joi from 'joi-browser';
import { Redirect } from 'react-router-dom';
import Form from '../common/form/Form';
import auth from '../../services/authService';
import { translateErrorMessage } from '../../services/errorMessageService';
import { PASSWORD, USERNAME } from '../../config/fieldNames';
import PropTypes from 'prop-types';
import ProtectedRoute from '../common/route/ProtectedRoute';
import Paper from '@material-ui/core/Paper/Paper';


class LoginForm extends Form {
    state = {
        data: {
            [USERNAME]: '',
            [PASSWORD]: '',
        },
        errors: {},
    };

    schema = {
        [USERNAME]: Joi.string()
            .required()
            .label('Username'),
        [PASSWORD]: Joi.string()
            .required()
            .label('Password'),
    };

    doSubmit = async () => {
        try {
            console.log('send request to login');
            const { data } = this.state;
            await auth.login(data[USERNAME], data[PASSWORD]);

            console.log('login with success!');

            const { state } = this.props.location;
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
            <Paper className='form-container'>

                <h1>Login</h1>
                <form onSubmit={this.handleSubmit} autoComplete='on'>
                    {this.renderTextInput([USERNAME], 'Username', 'TODO', true)}
                    {this.renderPasswordInput([PASSWORD], 'Password', 'TODO')}

                    {this.renderSubmitButton('Login')}
                </form>

            </Paper>
        );
    }
}

ProtectedRoute.propTypes = {
    location: PropTypes.object,
};

export default LoginForm;
