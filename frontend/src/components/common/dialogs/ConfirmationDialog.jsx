import React from 'react';
import PropTypes from 'prop-types';
import DialogContentText from '@material-ui/core/es/DialogContentText/DialogContentText';
import withMobileDialog from '@material-ui/core/es/withMobileDialog/withMobileDialog';
import DialogContent from '@material-ui/core/es/DialogContent/DialogContent';
import DialogActions from '@material-ui/core/es/DialogActions/DialogActions';
import DialogTitle from '@material-ui/core/es/DialogTitle/DialogTitle';
import Dialog from '@material-ui/core/Dialog/Dialog';
import Button from '@material-ui/core/es/Button/Button';
import { desktopDialogMaxWidth, mobileDialogBreakpoint } from '../../../config/theme';


const ConfirmationDialog = ({ header, content, onOk, open, onClose, fullScreen }) => {
    return (
        <Dialog
            fullScreen={fullScreen}
            scroll={'body'}
            maxWidth={desktopDialogMaxWidth}
            fullWidth={true}

            open={open}
            onClose={onClose}
            disableBackdropClick={true}
            disableEscapeKeyDown={true}
            aria-labelledby='confirmation-dialog'
        >

            <DialogTitle
                id='confirmation-dialog'
                className='form-header'
                disableTypography={true}
            >
                {header}
            </DialogTitle>

            <DialogContent>
                <DialogContentText>
                    {content}
                </DialogContentText>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} color='primary'>
                    Cancel
                </Button>
                <Button onClick={onOk} color='primary' autoFocus>
                    Ok
                </Button>
            </DialogActions>

        </Dialog>
    );
};

ConfirmationDialog.propTypes = {
    header: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    onOk: PropTypes.func.isRequired,

    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,

    fullScreen: PropTypes.bool.isRequired,
};

export default withMobileDialog({ breakpoint: mobileDialogBreakpoint })(ConfirmationDialog);
