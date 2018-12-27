import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { MuiThemeProvider } from '@material-ui/core/styles';
import auth from './services/authService';
import AlertServiceComponent, { alertService } from './services/alertService';
import AlertDemo from './components/___archive/AlertDemo';
import Playground from './components/___develop/Playground';
import LoginForm from './components/forms/LoginForm';
import Logout from './components/Logout';
import NotFound from './components/NotFound';
import ProtectedRoute from './components/common/route/ProtectedRoute';
import { theme } from './config/theme';
import RegisterForm from './components/forms/RegisterForm';
import { getCategories, getRootCategory } from './services/entities-services/categoryService';
import { translateErrorMessage } from './services/errorMessageService';
import {
    filterEntriesByByCategory, filterEntriesByCategoryAndDate,
    filterEntryByDate,
    getEntriesBetween,
    getRecentEntries,
    processEntries, processEntriesDate,
    processEntry,
    splitByDays,
} from './services/entities-services/entryService';
import EntryRegister from './components/entry-register/EntryRegister';
import LinearProgress from '@material-ui/core/es/LinearProgress/LinearProgress';
import EntryRecent from './components/entry-register/EntryRecent';
import Navbar from './components/navigation/Navbar';
import BarChart from './components/charts/BarChart';
import Chart3 from './components/charts/Chart3';
import SunburstChart from './components/charts/SunburstChart';
import { prepareDataStructureForBarChart, prepareDataStructureForSunburstChart } from './services/chartService';


class App extends Component {
    state = {
        user: null,
        rootCategory: null,

        recentEntries: null,

        entries: null,
        selectionSpec: null,
        filteredEntries: null,
    };

    fetchCategories = async user => {
        try {
            if (!user) return;
            const { data } = await getCategories();
            const rootCategory = getRootCategory(data);
            // alertService.info("Categories fetched.");
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
        console.log('APP handleEntriesChange, ' + operationType + ": ", entry);
        if (operationType === 'add') {
            const filteredEntry = filterEntryByDate(processEntry(entry), this.state.selectionSpec);
            const { entries: currentEntries, filteredEntries: currentFilteredEntries } = this.state;
            const entries = filteredEntry ? [...currentEntries, filteredEntry] : currentEntries;
            const filteredEntries = filteredEntry ? [...currentFilteredEntries, filteredEntry] : currentFilteredEntries;
            this.setState({ entries, filteredEntries });
        } else if (operationType === 'edit') {
            // remove from entries and filtered entries
            const oldEntries = [...this.state.entries];
            const oldFilteredEntries = [...this.state.filteredEntries];
            const entries = oldEntries.filter(e => e.idEntry !== entry.idEntry);
            const filteredEntries = oldFilteredEntries.filter(e => e.idEntry !== entry.idEntry);
            const filteredEntry = filterEntryByDate(processEntry(entry), this.state.selectionSpec);
            if (filteredEntry) entries.push(filteredEntry);
            if (filteredEntry) filteredEntries.push(filteredEntry);
            this.setState({ entries, filteredEntries });
        } else if (operationType === 'delete') {
            const oldEntries = [...this.state.entries];
            const oldFilteredEntries = [...this.state.filteredEntries];
            const entries = oldEntries.filter(e => e.idEntry !== entry.idEntry);
            const filteredEntries = oldFilteredEntries.filter(e => e.idEntry !== entry.idEntry);
            this.setState({ entries, filteredEntries });
        }
        this.fetchRecentEntries(this.state.user);
    };

    handleSelectionSpecChange = async selectionSpec => {
        try {
            const { from, to } = selectionSpec;
            const { entries: currentEntries, selectionSpec: currentSelectionSpec } = this.state;

            let filteredEntries;

            if (currentSelectionSpec) {
                const { from: currentFrom, to: currentTo } = currentSelectionSpec;
                if (+currentFrom === +from && +currentTo === +to) {
                    console.log('APP only filter entries by new selected categories', this.state);
                    filteredEntries = filterEntriesByByCategory(currentEntries, selectionSpec);
                    this.setState({ selectionSpec, filteredEntries });
                    return;
                }
            }

            console.log('APP fetch entries from server and filter them', this.state);
            const { data: rawEntries } = await getEntriesBetween(from, to);
            const entries = processEntriesDate(rawEntries);
            filteredEntries = filterEntriesByCategoryAndDate(entries, selectionSpec);
            this.setState({ entries, selectionSpec, filteredEntries });
        } catch (e) {
            if (e.response && [400, 401, 403].includes(e.response.status)) {
                const errors = translateErrorMessage(e.response.data.message);
                alertService.warning('Error occurred, entries cannot be fetched. Refresh Page.');
                this.setState({ errors });
            }
        }
    };

    componentDidMount() {
        const user = auth.getCurrentUser();
        this.setState({ user });

        this.fetchCategories(user);
        // setTimeout(() => {
        //     this.fetchCategories(user);
        // }, 3000);
    }

    render() {
        const { user, rootCategory, recentEntries, entries, selectionSpec, filteredEntries } = this.state;

        return (
            <MuiThemeProvider theme={theme}>

                <AlertServiceComponent />

                <Navbar
                    user={user}
                    rootCategory={rootCategory}
                    onRootCategoryChange={this.handleRootCategoryChange}
                    onEntriesChange={this.handleEntriesChange}
                    onSelectionSpecChange={this.handleSelectionSpecChange}
                >

                    {
                        (user && !rootCategory) ? <LinearProgress style={{width: '100%'}} /> : (
                            <Switch>

                                <Route exact path="/dev" render={props => (
                                    <Playground
                                        rootCategory={rootCategory}
                                        {...props}
                                    />
                                )} />

                                <ProtectedRoute exact path="/daily" render={props => (
                                    <EntryRegister
                                        rootCategory={rootCategory}
                                        entriesByDay={splitByDays(filteredEntries)}
                                        currency={user && user.currency}
                                        onEntriesChange={this.handleEntriesChange}
                                        {...props}
                                    />
                                )} />

                                <ProtectedRoute exact path="/recent" render={props => (
                                    <EntryRecent
                                        rootCategory={rootCategory}
                                        recentEntries={recentEntries}
                                        currency={user && user.currency}
                                        getRecentEntries={this.fetchRecentEntries}
                                        onEntriesChange={this.handleEntriesChange}
                                        {...props}
                                    />
                                )} />

                                <ProtectedRoute exact path="/barChart" render={props => (
                                    <BarChart
                                        dataStructure={prepareDataStructureForBarChart(filteredEntries, selectionSpec)}
                                        currency={user && user.currency}
                                        groupMode={false}
                                        {...props}
                                    />
                                )} />

                                <ProtectedRoute exact path="/sunburstChart" render={props => (
                                    <SunburstChart
                                        dataStructure={prepareDataStructureForSunburstChart(entries, rootCategory)}
                                        currency={user && user.currency}
                                        {...props}
                                    />
                                )} />

                                <ProtectedRoute exact path="/chart3" render={props => (
                                    <Chart3
                                        entries={entries}
                                        rootCategory={rootCategory}
                                        currency={user && user.currency}
                                        {...props}
                                    />
                                )} />

                                <Route exact path="/register" component={RegisterForm} />
                                <Route exact path="/login" component={LoginForm} />
                                <Route exact path="/logout" component={Logout} />

                                <ProtectedRoute exact path="/prot" component={AlertDemo} />

                                <Route exact path="/not-found" component={NotFound} />
                                <Redirect from="/" exact to="/recent" />
                                <Redirect to="/not-found" />
                            </Switch>
                        )
                    }

                </Navbar>

            </MuiThemeProvider>
        );
    }
}

export default App;
