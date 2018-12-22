import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import withMobileDialog from '@material-ui/core/es/withMobileDialog/withMobileDialog';
import DialogContentText from '@material-ui/core/es/DialogContentText/DialogContentText';
import DialogActions from '@material-ui/core/es/DialogActions/DialogActions';
import DialogContent from '@material-ui/core/es/DialogContent/DialogContent';
import Button from '@material-ui/core/es/Button/Button';
import Dialog from '@material-ui/core/Dialog/Dialog';
import Tabs from '@material-ui/core/es/Tabs/Tabs';
import Tab from '@material-ui/core/es/Tab/Tab';
import { desktopDialogMaxWidth, mobileDialogBreakpoint } from '../../config/theme';


class UserOptionDialog extends PureComponent {
    state = {
        openTabId: 0,
    };

    handleTabChange = (event, openTabId) => {
        this.setState({ openTabId });
    };

    render() {
        const { openTabId } = this.state;
        const { open, onClose, fullScreen } = this.props;

        return (
            <Dialog
                fullScreen={fullScreen}
                scroll={'body'}
                maxWidth={desktopDialogMaxWidth}
                fullWidth={true}

                open={open}
                onClose={onClose}
                disableBackdropClick={true}
                onEscapeKeyDown={onClose}
                aria-labelledby='user-tab-dialog'
            >

                <Tabs
                    value={openTabId}
                    onChange={this.handleTabChange}
                    indicatorColor='primary'
                    textColor='primary'
                    centered
                    fullWidth
                >

                    <Tab label='One' />
                    <Tab label='Two' />

                </Tabs>

                <DialogContent>
                    <DialogContentText>
                        {
                            openTabId === 0 && (
                                <p>Work in progress...</p>
                            )
                        }

                        {
                            openTabId === 1 && (
                                <p>Work in progress......</p>
                            )
                        }
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose} color='primary'>
                        Exit
                    </Button>
                </DialogActions>

            </Dialog>
        );
    }
}

UserOptionDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    fullScreen: PropTypes.bool.isRequired,
};

export default withMobileDialog({ breakpoint: mobileDialogBreakpoint })(UserOptionDialog);
