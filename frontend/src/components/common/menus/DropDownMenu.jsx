import React from 'react';
import PropTypes from 'prop-types';
import MenuOption from './MenuOption';
import Popper from '@material-ui/core/es/Popper/Popper';
import Grow from '@material-ui/core/es/Grow/Grow';
import Paper from '@material-ui/core/es/Paper/Paper';
import ClickAwayListener from '@material-ui/core/es/ClickAwayListener/ClickAwayListener';
import MenuList from '@material-ui/core/es/MenuList/MenuList';


const DropDownMenu = ({ anchorEl, menuOptions, onClose }) => {
    return (
        <Popper
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            transition
            disablePortal
            placement='bottom-end'
        >

            {({ TransitionProps }) => (
                <Grow
                    {...TransitionProps}
                >
                    <Paper>
                        <ClickAwayListener onClickAway={onClose}>
                            <MenuList>

                                {
                                    menuOptions.map(({ ...options }, index) => (
                                        <MenuOption key={index} {...options} />
                                    ))
                                }

                            </MenuList>
                        </ClickAwayListener>
                    </Paper>
                </Grow>
            )}

        </Popper>
    );
};

DropDownMenu.propTypes = {
    anchorEl: PropTypes.object,
    menuOptions: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        icon: PropTypes.element.isRequired,
        excluded: PropTypes.bool,
        onClick: PropTypes.func,
        redirect: PropTypes.string,
    })).isRequired,
    onClose: PropTypes.func.isRequired,
};

export default DropDownMenu;
