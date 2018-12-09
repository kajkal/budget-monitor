import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { blue } from '@material-ui/core/colors';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import auth from './services/authService';
import AlertServiceComponent from './services/alertService';
import AlertDemo from './components/_develop/AlertDemo';
import Navbar from './components/navigation/Navbar';
import Playground from './components/_develop/Playground';
import LoginForm from './components/form/LoginForm';
import Logout from './components/Logout';
import NotFound from './components/NotFound';
import ProtectedRoute from './components/common/route/ProtectedRoute';
import Home from './components/Home';

const theme = createMuiTheme({
    typography: {
        useNextVariants: true,
    },
    palette: {
        primary: blue,
        secondary: blue,
    },
});

class App extends Component {
    state = {
        user: null,
    };

    componentDidMount() {
        const user = auth.getCurrentUser();
        console.log('componentDidMount user: ', user);
        this.setState({ user });
    }

    render() {
        const { user } = this.state;
        console.log('render user: ', user);

        return (
            <MuiThemeProvider theme={theme}>
                <AlertServiceComponent />
                <Navbar user={user} />
                <main>
                    <Switch>
                        <Route path="/dev" component={Playground}/>

                        {/*TODO change to register form*/}
                        <Route path="/register" component={LoginForm}/>
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
