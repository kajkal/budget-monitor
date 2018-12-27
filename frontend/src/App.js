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
    filterEntriesByCategory, filterEntryByCategory,
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
import CalendarChart from './components/charts/CalendarChart';
import SunburstChart from './components/charts/SunburstChart';
import {
    prepareDataStructureForBarChart,
    prepareDataStructureForCalendarChart, prepareDataStructureForHourlyChart, prepareDataStructureForLineChart,
    prepareDataStructureForSunburstChart,
} from './services/chartService';
import HourlyChart from './components/charts/HourlyChart';
import LineChart from './components/charts/LineChart';


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
        const addEntry = (entry, entries, filteredEntries, selectionSpec) => {
            const processed = processEntry(entry);
            const filteredByDate = filterEntryByDate(processed, selectionSpec);
            const filteredByCategory = filterEntryByCategory(filteredByDate, selectionSpec);
            return ({
                entries: filteredByDate ? [...entries, filteredByDate] : entries,
                filteredEntries: filteredByCategory ? [...filteredEntries, filteredByCategory] : filteredEntries,
            });
        };
        const deleteEntry = (entry, entries, filteredEntries) => {
            return ({
                entries: entries.filter(e => e.idEntry !== entry.idEntry),
                filteredEntries: filteredEntries.filter(e => e.idEntry !== entry.idEntry),
            });
        };

        const operations = [
            {
                operation: 'add',
                process: (entry, currentEntries, currentFilteredEntries, selectionSpec) => {
                    return addEntry(entry, currentEntries, currentFilteredEntries, selectionSpec);
                },
            },
            {
                operation: 'edit',
                process: (entry, currentEntries, currentFilteredEntries, selectionSpec) => {
                    const { entries, filteredEntries } = deleteEntry(entry, currentEntries, currentFilteredEntries);
                    return addEntry(entry, entries, filteredEntries, selectionSpec);
                },
            },
            {
                operation: 'delete',
                process: (entry, currentEntries, currentFilteredEntries) => {
                    return deleteEntry(entry, currentEntries, currentFilteredEntries);
                },
            },
        ];

        const { entries: currentEntries, filteredEntries: currentFilteredEntries, selectionSpec } = this.state;
        const operation = operations.find(o => o.operation === operationType);
        if (!operation) return;

        const newState = operation.process(entry, currentEntries, currentFilteredEntries, selectionSpec);

        this.setState(newState);
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
                    filteredEntries = filterEntriesByCategory(currentEntries, selectionSpec);
                    this.setState({ selectionSpec, filteredEntries });
                    return;
                }
            }

            console.log('APP fetch entries from server and filter them', this.state);
            const { data: rawEntries } = await getEntriesBetween(from, to);
            const entries = processEntriesDate(rawEntries);
            filteredEntries = filterEntriesByCategory(entries, selectionSpec);
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

                                <ProtectedRoute exact path="/lineChart" render={props => (
                                    <LineChart
                                        dataStructure={prepareDataStructureForLineChart(filteredEntries, selectionSpec)}
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

                                <ProtectedRoute exact path="/hourlyChart" render={props => (
                                    <HourlyChart
                                        dataStructure={prepareDataStructureForHourlyChart(filteredEntries, selectionSpec)}
                                        currency={user && user.currency}
                                        {...props}
                                    />
                                )} />

                                <ProtectedRoute exact path="/calendarChart" render={props => (
                                    <CalendarChart
                                        dataStructure={prepareDataStructureForCalendarChart(entries, selectionSpec)}
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
