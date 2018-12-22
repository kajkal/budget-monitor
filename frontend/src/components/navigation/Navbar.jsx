import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Add, CallMade, PlaylistAdd, PowerSettingsNew, Settings, Menu } from '@material-ui/icons';
import Toolbar from '@material-ui/core/es/Toolbar/Toolbar';
import AppBar from '@material-ui/core/es/AppBar/AppBar';
import Typography from '@material-ui/core/es/Typography/Typography';
import Button from '@material-ui/core/es/Button/Button';
import EntryForm from '../forms/EntryForm';
import ButtonWithMenu from '../common/menus/ButtonWithMenu';
import CategoryOptionDialog from '../dialogs/CategoryOptionDialog';
import { categoryRootShape } from '../../config/propTypesCommon';
import UserOptionDialog from '../dialogs/UserOptionDialog';
import IconButton from '@material-ui/core/es/IconButton/IconButton';


class Navbar extends Component {
    state = {
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
            component: NavLink,
            to: '/logout'
        },
    ];

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
        const { user, rootCategory } = this.props;

        return (
            <AppBar position='static'>
                <Toolbar variant='dense'>

                    <IconButton
                        color="inherit"
                        onClick={() => console.log('open drawer')}
                        // className={classNames(classes.menuButton, open && classes.hide)}
                    >
                        <Menu />
                    </IconButton>


                    <Typography variant='h5' color='inherit' className='flex-grow-1'>
                        Budget Monitor
                    </Typography>

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
        );
    }
}

Navbar.propTypes = {
    user: PropTypes.object,
    rootCategory: categoryRootShape,
    onRootCategoryChange: PropTypes.func.isRequired,
    onEntriesChange: PropTypes.func.isRequired,
};

export default Navbar;
