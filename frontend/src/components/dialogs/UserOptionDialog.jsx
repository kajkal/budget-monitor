import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import withMobileDialog from '@material-ui/core/es/withMobileDialog/withMobileDialog';
import Dialog from '@material-ui/core/es/Dialog/Dialog';
import Tabs from '@material-ui/core/es/Tabs/Tabs';
import Tab from '@material-ui/core/es/Tab/Tab';
import { dialogPaperProps, mobileDialogBreakpoint } from '../../config/theme';


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
                maxWidth={mobileDialogBreakpoint}
                PaperProps={dialogPaperProps}

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
