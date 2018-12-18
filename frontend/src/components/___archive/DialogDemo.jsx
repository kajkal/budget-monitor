import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import TabsDemo from './TabsDemo';

class DialogDemo extends React.Component {
    state = {
        open: false,
    };

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    render() {
        const { fullScreen } = this.props;

        return (
            <div>
                <Button onClick={this.handleClickOpen}>Open responsive dialog</Button>
                <Dialog
                    fullScreen={fullScreen}
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="responsive-dialog-title"
                >

                    <TabsDemo handleClose={this.handleClose}/>


                </Dialog>
            </div>
        );
    }
}

DialogDemo.propTypes = {
    fullScreen: PropTypes.bool.isRequired,
};

export default withMobileDialog()(DialogDemo);
