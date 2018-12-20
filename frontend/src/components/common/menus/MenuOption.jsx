import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@material-ui/core/es/MenuItem/MenuItem';
import ListItemIcon from '@material-ui/core/es/ListItemIcon/ListItemIcon';
import ListItemText from '@material-ui/core/es/ListItemText/ListItemText';


const MenuOption = ({ icon, label, excluded = false, ...rest }) => {
    if (excluded) return null;
    return (
        <MenuItem {...rest} >

            <ListItemIcon className='m-0'>
                {icon}
            </ListItemIcon>

            <ListItemText primary={label} />

        </MenuItem>
    );
};

MenuOption.propTypes = {
    icon: PropTypes.element.isRequired,
    label: PropTypes.string.isRequired,
    excluded: PropTypes.bool,
    onClick: PropTypes.func,
    redirect: PropTypes.string,
};

export default MenuOption;
