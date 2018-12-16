import React from 'react';
import EntryForm from '../forms/EntryForm';
import Dialog from '@material-ui/core/Dialog/Dialog';
import PropTypes from 'prop-types';
import withMobileDialog from '@material-ui/core/withMobileDialog/withMobileDialog';

const EntryFormDialog = ({ type, currency, open, onClose, fullScreen }) => {
    return (
        <Dialog
            fullScreen={fullScreen}
            open={open}
            onClose={onClose}
        >
            <EntryForm currency={currency} type={type} onCancel={onClose}/>
        </Dialog>
    );
};

EntryFormDialog.propTypes = {
    type: PropTypes.oneOf(['expense', 'income']).isRequired,
    currency: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    fullScreen: PropTypes.bool.isRequired,
};

export default withMobileDialog()(EntryFormDialog);
