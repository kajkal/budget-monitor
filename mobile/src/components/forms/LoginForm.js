import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Joi from 'joi-browser';
import { Button, Content, Footer, FooterTab, Form, Text } from 'native-base';
import TextInput from '../common/form/inputs/TextInput';
import PasswordInput from '../common/form/inputs/PasswordInput';
import authService from './../../services/authService';
import { translateErrorMessage } from '../../services/errorMessageService';
import LoadingScreen, { allAreTruthy } from '../loading/LoadingScreen';


class LoginForm extends PureComponent {
    state = {
        requestSend: false,
        data: {
            username: '',
            password: '',
        },
        errors: {},
    };

    schema = {
        username: Joi.string()
            .required()
            .label('Username'),
        password: Joi.string()
            .required()
            .label('Password'),
    };

    handleSubmit = async errors => {
        if (errors) {
            this.setState({ errors });
            return;
        }

        try {
            const { username, password } = this.state.data;
            this.setState({ requestSend: true });
            await authService.login(username, password);
            this.props.onLogin();
        } catch (e) {
            if (e.response && [400, 401].includes(e.response.status)) {
                const errors = translateErrorMessage(e.response.data.message);
                this.setState({ errors, requestSend: false });
            }
        }
    };

    validate = () => {
        const options = { abortEarly: false };
        const { error } = Joi.validate(this.state.data, this.schema, options);
        if (!error) return null;

        const errors = {};
        for (let item of error.details) errors[item.path[0]] = item.message;
        return errors;
    };

    validateProperty = (name, value) => {
        const obj = { [name]: value };
        const schema = { [name]: this.schema[name] };
        const { error } = Joi.validate(obj, schema);

        return error ? error.details[0].message : null;
    };

    handleChange = name => value => {
        const errors = { ...this.state.errors };
        const errorMessage = this.validateProperty(name, value);
        if (errorMessage) errors[name] = errorMessage;
        else delete errors[name];

        const data = { ...this.state.data };
        data[name] = value;
        this.setState({ data, errors });
    };

    render() {
        const { requestSend } = this.state;
        const { username, password } = this.state.data;
        const { username: usernameErr, password: passwordErr } = this.state.errors;
        const errors = this.validate();

        if (allAreTruthy(requestSend)) return <LoadingScreen />;
        return (
            <React.Fragment>

                <Content>
                    <Form>

                        <TextInput
                            label='Username'
                            value={username}
                            onChange={this.handleChange('username')}
                            error={usernameErr}
                            autoFocus={true}
                        />

                        <PasswordInput
                            label='Password'
                            value={password}
                            onChange={this.handleChange('password')}
                            error={passwordErr}
                        />

                    </Form>
                </Content>

                <Footer>
                    <FooterTab>

                        <Button
                            full={true}
                            disabled={Boolean(errors)}
                            onPress={() => this.handleSubmit(errors)}
                        >
                            <Text>Login</Text>
                        </Button>

                    </FooterTab>
                </Footer>

            </React.Fragment>
        );
    }
}

LoginForm.propTypes = {
    onLogin: PropTypes.func.isRequired,
};

export default LoginForm;
