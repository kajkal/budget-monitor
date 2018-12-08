import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withSnackbar } from 'notistack';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import logger from './logService';

let enqueueAlertFunction = null;

const displayAlert = (message, variant) => {
    if (enqueueAlertFunction)
        enqueueAlertFunction(message, {
            variant: variant,
            action: (
                <IconButton
                    key="close"
                    aria-label="Close"
                    color="inherit"
                >
                    <CloseIcon />
                </IconButton>
            ),
            autoHideDuration: 2000,
        });
    else
        logger.log('enqueueAlertFunction not initialized.');
};

class AlertServiceComponent extends Component {
    constructor(props) {
        super(props);
        // console.log('Alert service initialized.');
        enqueueAlertFunction = this.props.enqueueSnackbar;
    }

    render() {
        return null;
    }
}

AlertServiceComponent.propTypes = {
    enqueueSnackbar: PropTypes.func.isRequired,
};

export default withSnackbar(AlertServiceComponent);

export const alertService = {
    default: (message) => displayAlert(message, 'default'),
    info: (message) => displayAlert(message, 'info'),
    success: (message) => displayAlert(message, 'success'),
    warning: (message) => displayAlert(message, 'warning'),
    error: (message) => displayAlert(message, 'error')
};
