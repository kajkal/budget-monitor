import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Container } from 'native-base';
import LoginForm from './forms/LoginForm';
import authService from './../services/authService';
import LoadingScreen, { allAreTruthy } from './loading/LoadingScreen';


class LoginScreen extends PureComponent {
    static navigationOptions = {
        title: 'Budget Monitor',
    };

    state = {
        isUserAlreadyAuthenticated: true,
    };

    goToHomeScreen = user => {
        const { navigation } = this.props;
        const stringifyUser = JSON.stringify(user);
        console.log('User is logged in => redirect to home screen with user: ', stringifyUser);
        navigation.replace('Home', { user: stringifyUser });
    };

    async componentDidMount() {
        // console.log('LoginScreen componentDidMount isUserAlreadyAuthenticated', this.state.isUserAlreadyAuthenticated);
        const user = await authService.getCurrentUser();
        if (user) this.goToHomeScreen(user);
        else this.setState({ isUserAlreadyAuthenticated: false });
    }

    handleLogin = async () => {
        const user = await authService.getCurrentUser();
        if (user) this.goToHomeScreen(user);
    };

    render() {
        const { isUserAlreadyAuthenticated } = this.state;

        // console.log('LoginScreen render: isUserAlreadyAuthenticated', isUserAlreadyAuthenticated);
        if (allAreTruthy(isUserAlreadyAuthenticated)) return <LoadingScreen/>;
        return (
            <Container>
                <LoginForm onLogin={this.handleLogin}/>
            </Container>
        );
    }
}

LoginScreen.propTypes = {
    navigation: PropTypes.shape({
        replace: PropTypes.func.isRequired,
    }).isRequired,
};

export default LoginScreen;
