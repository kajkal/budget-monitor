import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { MuiThemeProvider } from '@material-ui/core/styles';
import auth from './services/authService';
import AlertServiceComponent from './services/alertService';
import AlertDemo from './components/___archive/AlertDemo';
import Navbar from './components/navigation/Navbar';
import Playground from './components/___develop/Playground';
import New from './components/___develop/New';
import LoginForm from './components/forms/LoginForm';
import Logout from './components/Logout';
import NotFound from './components/NotFound';
import ProtectedRoute from './components/common/route/ProtectedRoute';
import Home from './components/Home';
import { theme } from './config/theme';
import RegisterForm from './components/forms/RegisterForm';
import Test from './components/___develop/Test';
import { getRootCategory } from './services/entities-services/categoryService';


class App extends Component {
    state = {
        user: null,
        rootCategory: null,
    };

    componentDidMount() {
        const user = auth.getCurrentUser();
        const rootCategory = getRootCategory();
        if (user) user.currency = 'EUR';
        this.setState({ user, rootCategory });
    }

    render() {
        const { user, rootCategory } = this.state;

        return (
            <MuiThemeProvider theme={theme}>

                <AlertServiceComponent />
                <Navbar user={user} rootCategory={rootCategory} />
                <main>
                    <Switch>
                        <Route path="/dev" component={Playground}/>
                        <Route path="/test" component={Test}/>
                        <Route path="/new" component={New}/>

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
