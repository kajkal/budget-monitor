import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import Tooltip from '@material-ui/core/es/Tooltip/Tooltip';
import Button from '@material-ui/core/es/Button/Button';
import DropDownMenu from './DropDownMenu';


class ButtonWithMenu extends PureComponent {
    state = {
        anchorEl: null,
    };

    handleToggle = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    render() {
        const { anchorEl } = this.state;
        const { buttonLabel, buttonTooltip, menuOptions } = this.props;
        const open = Boolean(anchorEl);

        return (
            <React.Fragment>

                <Tooltip title={buttonTooltip} enterDelay={500} leaveDelay={200}>
                    <Button
                        aria-owns={open ? 'menu-list-grow' : undefined}
                        aria-haspopup='true'
                        onClick={this.handleToggle}
                        color='inherit'
                        style={{ textTransform: 'none' }}
                    >
                        {buttonLabel} {open ? <ExpandLess /> : <ExpandMore />}
                    </Button>
                </Tooltip>

                <DropDownMenu
                    anchorEl={anchorEl}
                    menuOptions={menuOptions}
                    onClose={this.handleClose}
                />

            </React.Fragment>
        );
    }
}

ButtonWithMenu.propTypes = {
    buttonLabel: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element,
    ]).isRequired,

    buttonTooltip: PropTypes.string,

    menuOptions: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        icon: PropTypes.element.isRequired,
        excluded: PropTypes.bool,
        onClick: PropTypes.func,
        redirect: PropTypes.string,
    })).isRequired,
};

export default ButtonWithMenu;
