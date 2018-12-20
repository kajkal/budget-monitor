import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { MuiThemeProvider } from '@material-ui/core/styles';
import auth from './services/authService';
import AlertServiceComponent, { alertService } from './services/alertService';
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
import { getCategories, getRootCategory } from './services/entities-services/categoryService';
import { translateErrorMessage } from './services/errorMessageService';


class App extends Component {
    state = {
        user: null,
        rootCategory: null,
    };

    fetchCategories = async user => {
        try {
            if (!user) return;
            const { data } = await getCategories();
            const rootCategory = getRootCategory(data);
            alertService.info("Categories fetched.");
            this.setState({ rootCategory });
        } catch (e) {
            if (e.response && [400, 401, 403].includes(e.response.status)) {
                console.log('error while fetching categories: ', e);
                console.log('messageKey: ', e.response.data.message);
                const errors = translateErrorMessage(e.response.data.message);
                console.log('translated errors: ', errors);
            }
        }
    };

    componentDidMount() {
        const user = auth.getCurrentUser();
        this.setState({ user });
        this.fetchCategories(user);
    }

    handleRootCategoryChange = () => {
        this.fetchCategories(this.state.user);
    };

    render() {
        const { user, rootCategory } = this.state;

        return (
            <MuiThemeProvider theme={theme}>

                <AlertServiceComponent />
                <Navbar user={user} rootCategory={rootCategory} onRootCategoryChange={this.handleRootCategoryChange} />
                <main>
                    <Switch>
                        <Route path="/dev" render={props => <Playground rootCategory={rootCategory} onRootCategoryChange={this.handleRootCategoryChange} {...props}/>}/>
                        <Route path="/test" component={Test}/>
                        <Route path="/new" render={props => <New rootCategory={rootCategory} {...props}/>}/>

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
