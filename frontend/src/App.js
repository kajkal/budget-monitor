import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { MuiThemeProvider } from '@material-ui/core/styles';
import auth from './services/authService';
import AlertServiceComponent from './services/alertService';
import AlertDemo from './components/___develop/AlertDemo';
import Navbar from './components/navigation/Navbar';
import Playground from './components/___develop/Playground';
import LoginForm from './components/form/LoginForm';
import Logout from './components/Logout';
import NotFound from './components/NotFound';
import ProtectedRoute from './components/common/route/ProtectedRoute';
import Home from './components/Home';
import RegisterForm from './components/form/RegisterForm';
import { theme } from './config/theme';


class App extends Component {
    state = {
        user: null,
    };

    componentDidMount() {
        const user = auth.getCurrentUser();
        this.setState({ user });
    }

    render() {
        const { user } = this.state;

        return (
            <MuiThemeProvider theme={theme}>

                <AlertServiceComponent />
                <Navbar user={user} />
                <main>
                    <Switch>
                        <Route path="/dev" component={Playground}/>

                        <Route path="/register" component={RegisterForm}/>
                        <Route path="/login" component={LoginForm}/>
                        <Route path="/logout" component={Logout}/>

                        <ProtectedRoute path="/home" component={Home}/>
                        <ProtectedRoute path="/prot" component={AlertDemo}/>

                        <Route path="/not-found" component={NotFound}/>
                        <Redirect from="/" exact to="/home"/>
                        <Redirect to="/not-found"/>
                    </Switch>
                </main>

            </MuiThemeProvider>
        );
    }
}

export default App;
