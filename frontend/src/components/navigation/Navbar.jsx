import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Add, CallMade, Menu, PlaylistAdd, PowerSettingsNew, Settings, Restore, CalendarToday } from '@material-ui/icons';
import { PieChart, BarChart, ShowChart } from '@material-ui/icons';
import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/es/Button/Button';
import { Link, NavLink } from 'react-router-dom';
import _ from 'lodash';
import ButtonWithMenu from '../common/menus/ButtonWithMenu';
import EntryForm from '../forms/EntryForm';
import UserOptionDialog from '../dialogs/UserOptionDialog';
import CategoryOptionDialog from '../dialogs/CategoryOptionDialog';
import { categoryRootShape } from '../../config/propTypesCommon';
import CategoryList from '../common/lists/CategoryList';
import NavigationLink from './NavigationLink';

const drawerWidth = 300;

const styles = theme => ({
    drawer: {
        [theme.breakpoints.up('md')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    appBar: {
        marginLeft: drawerWidth,
        [theme.breakpoints.up('md')]: {
            width: `calc(100% - ${drawerWidth}px)`,
        },
    },
    toolbar: {
        justifyContent: 'flex-end',
    },
    menuButton: {
        marginRight: 'auto',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        ...theme.mixins.toolbar,
    },
    drawerPaper: {
        width: drawerWidth,
    },
});

class Navbar extends PureComponent {
    state = {
        mobileOpen: false,
        incomeFormDialogOpen: false,
        expenseFormDialogOpen: false,
        userOptionDialogOpen: false,
        categoryOptionDialogOpen: false,
    };

    newEntryOptions = [
        {
            label: 'Income',
            icon: <CallMade className='positive' />,
            onClick: () => this.setState({ incomeFormDialogOpen: true }),
        },
        {
            label: 'Expense',
            icon: <CallMade className='negative mirrorY' />,
            onClick: () => this.setState({ expenseFormDialogOpen: true }),
        },
    ];

    userOptions = [
        {
            label: 'Settings',
            icon: <Settings />,
            onClick: () => this.setState({ userOptionDialogOpen: true }),
        },
        {
            label: 'Categories',
            icon: <PlaylistAdd />,
            onClick: () => this.setState({ categoryOptionDialogOpen: true }),
        },
        {
            label: 'Logout',
            icon: <PowerSettingsNew />,
            component: Link,
            to: '/logout',
        },
    ];


    handleDrawerToggle = () => {
        this.setState(state => ({ mobileOpen: !state.mobileOpen }));
    };

    handleDialogClose = () => {
        this.setState({
            incomeFormDialogOpen: false,
            expenseFormDialogOpen: false,
            userOptionDialogOpen: false,
            categoryOptionDialogOpen: false,
        });
    };

    renderEntryFormDialog = (type, currency) => {
        const { incomeFormDialogOpen, expenseFormDialogOpen } = this.state;
        const { rootCategory, onEntriesChange } = this.props;
        const open = type === 'income' ? incomeFormDialogOpen : expenseFormDialogOpen;
        if (!open) return null;
        return (
            <EntryForm
                type={type}
                currency={currency}
                rootCategory={rootCategory}
                open={open}
                onClose={this.handleDialogClose}
                onEntriesChange={onEntriesChange}
            />
        );
    };

    renderUserOptionDialog = () => {
        const { userOptionDialogOpen } = this.state;
        if (!userOptionDialogOpen) return null;
        return (
            <UserOptionDialog
                open={userOptionDialogOpen}
                onClose={this.handleDialogClose}
            />
        );
    };

    renderCategoryOptionDialog = () => {
        const { categoryOptionDialogOpen } = this.state;
        if (!categoryOptionDialogOpen) return null;
        const { rootCategory, onRootCategoryChange } = this.props;
        return (
            <CategoryOptionDialog
                open={categoryOptionDialogOpen}
                onClose={this.handleDialogClose}
                rootCategory={rootCategory}
                onRootCategoryChange={onRootCategoryChange}
            />
        );
    };


    render() {
        const { classes, theme, user, rootCategory, children } = this.props;

        const drawer = (
            <div>

                <Typography className={classes.drawerHeader} variant='h6'>
                    Budget Monitor
                </Typography>

                <Divider />
                <List>

                    {/*TODO: only for logged users*/}
                    <NavigationLink
                        icon={<Restore />}
                        label={'Recent'}
                        to={'/recent'}
                    />

                    <NavigationLink
                        icon={<CalendarToday />}
                        label={'Entries by day'}
                        to={'/register'}
                    />

                    <NavigationLink
                        icon={<PieChart />}
                        label={'Chart 1'}
                        to={'/not-found'}
                    />

                    <NavigationLink
                        icon={<BarChart />}
                        label={'Chart 2'}
                        to={'/not-found'}
                    />

                    <NavigationLink
                        icon={<ShowChart />}
                        label={'Chart 3'}
                        to={'/not-found'}
                    />

                </List>

                <Divider />
                <List>

                    {
                        user && rootCategory && (
                            <CategoryList
                                rootCategory={rootCategory}
                                onSelect={(category) => console.log('selected: ', category)}
                                dense={true}
                            />
                        )
                    }

                </List>

            </div>
        );

        return (
            <React.Fragment>

                <AppBar position="fixed" className={classes.appBar}>
                    <Toolbar className={classes.toolbar}>

                        <IconButton
                            color="inherit"
                            onClick={this.handleDrawerToggle}
                            className={classes.menuButton}
                        >
                            <Menu />
                        </IconButton>

                        {!user && (
                            <React.Fragment>
                                <Button component={NavLink} to={'/login'} color='inherit'>
                                    Login
                                </Button>
                                <Button component={NavLink} to={'/register'} color='inherit'>
                                    Register
                                </Button>
                            </React.Fragment>
                        )}

                        {user && !_.isEmpty(rootCategory) && (
                            <React.Fragment>

                                <ButtonWithMenu
                                    buttonLabel={<Add />}
                                    buttonTooltip='Add'
                                    menuOptions={this.newEntryOptions}
                                />

                                {this.renderEntryFormDialog('income', user.currency)}
                                {this.renderEntryFormDialog('expense', user.currency)}


                                <ButtonWithMenu
                                    buttonLabel={user.sub}
                                    buttonTooltip='Options'
                                    menuOptions={this.userOptions}
                                />

                                {this.renderUserOptionDialog()}
                                {this.renderCategoryOptionDialog()}

                            </React.Fragment>
                        )}


                    </Toolbar>
                </AppBar>

                <nav className={classes.drawer}>

                    <Hidden mdUp implementation="css">
                        <Drawer
                            container={this.props.container}
                            variant="temporary"
                            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                            open={this.state.mobileOpen}
                            onClose={this.handleDrawerToggle}
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                        >
                            {drawer}
                        </Drawer>
                    </Hidden>


                    <Hidden smDown implementation="css">
                        <Drawer
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                            variant="permanent"
                            open
                        >
                            {drawer}
                        </Drawer>
                    </Hidden>


                </nav>

                {children}

            </React.Fragment>
        );
    }
}

Navbar.propTypes = {
    user: PropTypes.object,
    rootCategory: categoryRootShape,
    onRootCategoryChange: PropTypes.func.isRequired,
    onEntriesChange: PropTypes.func.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]).isRequired,

    classes: PropTypes.object.isRequired,
    container: PropTypes.object,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Navbar);