import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import Joi from 'joi-browser';
import Paper from '@material-ui/core/Paper/Paper';
import Form from '../common/forms/Form';
import ProtectedRoute from '../common/route/ProtectedRoute';
import { PASSWORD, USERNAME } from '../../config/fieldNames';
import { translateErrorMessage } from '../../services/errorMessageService';
import auth from '../../services/authService';


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
            const { data } = this.state;
            await auth.login(data[USERNAME], data[PASSWORD]);

            const { state } = this.props.location;
            window.location = state ? state.from.pathname : '/';
        } catch (e) {
            if (e.response && [400, 401].includes(e.response.status)) {
                const errors = translateErrorMessage(e.response.data.message);
                this.setState({ errors });
            }
        }
    };

    render() {
        if (auth.getCurrentUser()) return <Redirect to='/' />;

        return (
            <Paper className='form-container'>

                <form autoComplete='on' onKeyDown={this.onEnterDown}>
                    <header className='form-header'>
                        Login
                    </header>

                    <div className='form-content login-form'>
                        {this.renderTextInput([USERNAME], 'Username', {}, {className: 'username-input', focus: true})}
                        {this.renderPasswordInput([PASSWORD], 'Password', {}, {className: 'password-input'})}
                    </div>

                    <footer>
                        {this.renderSubmitButton('Login')}
                    </footer>
                </form>

            </Paper>
        );
    }
}

ProtectedRoute.propTypes = {
    location: PropTypes.object,
};

export default LoginForm;
