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
import { getCategories, getRootCategory, setRootCategory } from './services/entities-services/categoryService';
import { translateErrorMessage } from './services/errorMessageService';
import {
    getEntries,
    getRecentEntries,
    processEntries,
    processEntry,
    splitByDays,
} from './services/entities-services/entryService';
import EntryRegister from './components/entry-register/EntryRegister';
import LinearProgress from '@material-ui/core/es/LinearProgress/LinearProgress';
import EntryRecent from './components/entry-register/EntryRecent';


class App extends Component {
    state = {
        user: null,
        rootCategory: null,
        entries: null,
        recentEntries: null,
    };

    fetchCategories = async user => {
        try {
            if (!user) return;
            const { data } = await getCategories();
            const rootCategory = getRootCategory(data);
            // alertService.info("Categories fetched.");
            this.setState({ rootCategory });
            setRootCategory(rootCategory);
        } catch (e) {
            if (e.response && [400, 401, 403].includes(e.response.status)) {
                console.log('error while fetching categories: ', e);
                console.log('messageKey: ', e.response.data.message);
                const errors = translateErrorMessage(e.response.data.message);
                console.log('translated errors: ', errors);
            }
        }
    };

    fetchEntries = async user => {
        try {
            if (!user) return;
            const { data: rawEntries } = await getEntries();
            const entries = processEntries(rawEntries);
            this.setState({ entries });
        } catch (e) {
            if (e.response && [400, 401, 403].includes(e.response.status)) {
                console.log('error while fetching entries: ', e);
                console.log('messageKey: ', e.response.data.message);
                const errors = translateErrorMessage(e.response.data.message);
                console.log('translated errors: ', errors);
            }
        }
    };

    fetchRecentEntries = async () => {
        try {
            const { data: rawRecentEntries } = await getRecentEntries();
            const recentEntries = processEntries(rawRecentEntries);
            this.setState({ recentEntries });
        } catch (e) {
            if (e.response && [400, 401, 403].includes(e.response.status)) {
                alertService.warning('Error occured, please refresh page.');
                const errors = translateErrorMessage(e.response.data.message);
                console.log('error while fetching recent entries: ', errors);
            }
        }
    };

    handleRootCategoryChange = () => {
        this.fetchCategories(this.state.user);
    };

    handleEntriesChange = (entry, operationType) => {
        if (operationType === 'add') {
            const entries = [ ...this.state.entries, processEntry(entry) ];
            this.setState({ entries });
        } if (operationType === 'edit') {
            const oldEntries = [ ...this.state.entries ];
            const entries = oldEntries.filter(e => e.idEntry !== entry.idEntry);
            entries.push(processEntry(entry));
            this.setState({ entries });
        } else if (operationType === 'delete') {
            const oldEntries = [ ...this.state.entries ];
            const entries = oldEntries.filter(e => e.idEntry !== entry.idEntry);
            this.setState({ entries });
        }
        this.fetchRecentEntries(this.state.user);
    };

    componentDidMount() {
        const user = auth.getCurrentUser();
        this.setState({ user });
        this.fetchCategories(user);

        this.fetchEntries(user);
        // setTimeout(() => {
        //     this.fetchEntries(user);
        // }, 2000);
    }

    render() {
        const { user, rootCategory, entries, recentEntries } = this.state;

        return (
            <MuiThemeProvider theme={theme}>

                <AlertServiceComponent />

                <Navbar
                    user={user}
                    rootCategory={rootCategory}
                    onRootCategoryChange={this.handleRootCategoryChange}
                    onEntriesChange={this.handleEntriesChange}
                />

                {user && (!rootCategory || !entries) && <LinearProgress />}
                <main>
                    <Switch>
                        <Route path="/dev" component={Playground} />
                        <Route path="/test" render={props => (
                            <EntryRegister
                                rootCategory={rootCategory}
                                entriesByDay={splitByDays(entries)}
                                currency={user && user.currency}
                                onEntriesChange={this.handleEntriesChange}
                                {...props}
                            />
                        )} />
                        <ProtectedRoute path="/recent" render={props => (
                            <EntryRecent
                                rootCategory={rootCategory}
                                recentEntries={recentEntries}
                                currency={user && user.currency}
                                getRecentEntries={this.fetchRecentEntries}
                                onEntriesChange={this.handleEntriesChange}
                                {...props}
                            />
                        )} />
                        <Route path="/new" render={props => <New rootCategory={rootCategory} {...props} />} />

                        <Route path="/register" component={RegisterForm} />
                        <Route path="/login" component={LoginForm} />
                        <Route path="/logout" component={Logout} />

                        <ProtectedRoute path="/home" component={Home} />
                        <ProtectedRoute path="/prot" component={AlertDemo} />

                        <Route path="/not-found" component={NotFound} />
                        <Redirect from="/" exact to="/home" />
                        <Redirect to="/not-found" />
                    </Switch>
                </main>

            </MuiThemeProvider>
        );
    }
}

export default App;
