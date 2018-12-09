import React, { Component } from 'react';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import AppBar from '@material-ui/core/AppBar/AppBar';
import Typography from '@material-ui/core/Typography/Typography';
import Button from '@material-ui/core/Button/Button';
import {PowerSettingsNew, Settings, Add, CallMade} from '@material-ui/icons';
import DropdownMenu from './DropdownMenu';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';


class Navbar extends Component {
    newEntryOptions = [
        {
            label: 'Income',
            icon: <CallMade className='positive'/>,
            onClick: () => console.log('Income on click')
        },
        {
            label: 'Expense',
            icon: <CallMade className='negative mirrorY'/>,
            onClick: () => console.log('Expense on click')
        },
    ];

    userOptions = [
        {
            label: "Settings",
            icon: <Settings />,
            onClick: () => console.log('Settings on click')
        },
        {
            label: "Logout",
            icon: <PowerSettingsNew />,
            redirect: '/logout'
        },
    ];

    render() {
        const { user } = this.props;
        return (
            <AppBar position="static">
                <Toolbar variant="dense">

                    <Typography variant="h5" color="inherit" className='flex-grow-1'>
                        Budget Monitor
                    </Typography>

                    {/*TODO: remove buttons?*/}
                    {!user && (
                        <React.Fragment>
                            <Button component={NavLink} to={"/login"} color="inherit">
                                Login
                            </Button>
                            <Button component={NavLink} to={"/register"} color="inherit">
                                Register
                            </Button>
                        </React.Fragment>
                    )}

                    {user && (
                        <React.Fragment>
                            <DropdownMenu label={<Add/>} items={this.newEntryOptions} />
                            <DropdownMenu label={user.sub} items={this.userOptions} />
                        </React.Fragment>
                    )}

                </Toolbar>
            </AppBar>
        );
    }
}

Navbar.propTypes = {
    user: PropTypes.object
};

export default Navbar;
