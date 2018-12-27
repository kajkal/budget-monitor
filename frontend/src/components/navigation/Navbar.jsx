import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
    Add,
    BarChart,
    CalendarToday,
    CallMade,
    Menu,
    PieChart,
    PlaylistAdd,
    PowerSettingsNew,
    Restore,
    Settings,
    ShowChart,
    Info
} from '@material-ui/icons';
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
import { categoryShape } from '../../config/propTypesCommon';
import NavigationLink from './NavigationLink';
import EntriesSelectionForm from '../forms/EntriesSelectionForm';


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
    fakeToolbar: theme.mixins.toolbar,
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
    content: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    applicationContent: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
});

class Navbar extends PureComponent {
    state = {
        mobileOpen: false,
        incomeFormDialogOpen: false,
        expenseFormDialogOpen: false,
        userOptionDialogOpen: false,
        categoryOptionDialogOpen: false,

        expandedCategories: [],
        selectedCategories: [],
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

    handleCategoryExpandToggle = expandedCategories => {
        this.setState({ expandedCategories });
    };

    handleSelectionSpecChange = selectionSpec => {
        this.props.onSelectionSpecChange(selectionSpec);
        const { selectedCategories } = selectionSpec;
        this.setState({ selectedCategories });
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
        const { expandedCategories, selectedCategories } = this.state;
        const { classes, theme, user, rootCategory, children } = this.props;

        const drawer = (
            <div>

                <Typography className={classes.drawerHeader} variant='h6'>
                    Budget Monitor
                </Typography>

                <Divider />

                {!user && (
                    <React.Fragment>
                        <List>
                            <NavigationLink
                                icon={<Info />}
                                label={'About Budget Monitor'}
                                to={'/about'}
                            />

                            < NavigationLink
                                icon={<CalendarToday />}
                                label={'Entries by day'}
                                to={'/register'}
                            />
                        </List>
                    </React.Fragment>
                )}

                {user && (
                    <React.Fragment>
                        <List>
                            <NavigationLink
                                icon={<Restore />}
                                label={'Recent'}
                                to={'/recent'}
                            />

                            < NavigationLink
                                icon={<CalendarToday />}
                                label={'Entries by day'}
                                to={'/daily'}
                            />

                            <NavigationLink
                                icon={<BarChart />}
                                label={'Bar chart'}
                                to={'/barChart'}
                            />

                            <NavigationLink
                                icon={<PieChart />}
                                label={'Sunburst chart'}
                                to={'/sunburstChart'}
                            />

                            <NavigationLink
                                icon={<ShowChart />}
                                label={'Chart 3'}
                                to={'/chart3'}
                            />
                        </List>
                        <Divider />
                    </React.Fragment>
                )}

                {user && rootCategory && (
                    <List>
                        <EntriesSelectionForm
                            rootCategory={rootCategory}
                            expandedCategories={expandedCategories}
                            selectedCategories={selectedCategories}
                            onCategoryExpandToggle={this.handleCategoryExpandToggle}
                            onSelectionSpecChange={this.handleSelectionSpecChange}
                        />
                    </List>
                )}

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

                <div className={classes.content}>
                    <div className={classes.fakeToolbar} />
                    <main className={classes.applicationContent}>
                        {children}
                    </main>
                </div>

            </React.Fragment>
        );
    }
}

Navbar.propTypes = {
    user: PropTypes.object,
    rootCategory: categoryShape,
    onRootCategoryChange: PropTypes.func.isRequired,
    onEntriesChange: PropTypes.func.isRequired,
    onSelectionSpecChange: PropTypes.func.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]).isRequired,

    classes: PropTypes.object.isRequired,
    container: PropTypes.object,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Navbar);