import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import Button from '@material-ui/core/Button/Button';
import Grow from '@material-ui/core/Grow/Grow';
import Paper from '@material-ui/core/Paper/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener/ClickAwayListener';
import MenuList from '@material-ui/core/MenuList/MenuList';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import Popper from '@material-ui/core/Popper/Popper';
import ListItemText from '@material-ui/core/ListItemText/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon/ListItemIcon';

class DropdownMenu extends Component {
    state = {
        open: false
    };

    handleToggle = () => {
        this.setState(state => ({ open: !state.open }));
    };

    handleClose = event => {
        if (this.anchorEl.contains(event.target)) {
            return;
        }
        this.setState({ open: false });
    };

    render() {
        const { open } = this.state;
        const { label, items } = this.props;

        return (
            <React.Fragment>
                <Button
                    buttonRef={node => {
                        this.anchorEl = node;
                    }}
                    aria-owns={open ? 'menu-list-grow' : undefined}
                    aria-haspopup="true"
                    onClick={this.handleToggle}
                    color="inherit"
                    style={{textTransform: 'none'}}
                >
                    {label} {open ? <ExpandLess /> : <ExpandMore />}
                </Button>

                <Popper
                    open={open}
                    anchorEl={this.anchorEl}
                    transition
                    disablePortal
                    placement='bottom-end'
                >
                    {({ TransitionProps }) => (
                        <Grow
                            {...TransitionProps}
                            id="menu-list-grow"
                        >
                            <Paper>
                                <ClickAwayListener onClickAway={this.handleClose}>
                                    <MenuList>
                                        {
                                            items.map((item, index) =>
                                                <MenuItem key={index} onClick={item.onClick}>

                                                    <ListItemIcon className='m-0'>
                                                        {item.icon}
                                                    </ListItemIcon>

                                                    <ListItemText inset primary={item.label} />

                                                </MenuItem>
                                            )
                                        }
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                        )}
                </Popper>

            </React.Fragment>
        );
    }
}

DropdownMenu.propTypes = {
    label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element,
    ]).isRequired,

    items: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        icon: PropTypes.element.isRequired,
        onClick: PropTypes.func.isRequired
    })).isRequired
};

export default DropdownMenu;
