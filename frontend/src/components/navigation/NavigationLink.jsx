import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import ListItemIcon from '@material-ui/core/ListItemIcon/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText/ListItemText';
import ListItem from '@material-ui/core/ListItem/ListItem';
import { withStyles } from '@material-ui/core';

const styles = theme => ({
    active: {
        backgroundColor: theme.palette.action.selected
    }
});

const NavigationLink = ({ icon, label, to, classes }) => {
    return (
        <ListItem
            button
            component={NavLink}
            to={to}
            activeClassName={classes.active}
        >

            <ListItemIcon className='m-0'>
                {icon}
            </ListItemIcon>

            <ListItemText primary={label} />

        </ListItem>
    );
};

NavigationLink.propTypes = {
    icon: PropTypes.element.isRequired,
    label: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,

    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NavigationLink);
