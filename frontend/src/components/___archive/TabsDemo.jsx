import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import Button from '@material-ui/core/Button/Button';

function TabContainer(props) {
    // return (
    //     <Typography component="div" style={{ padding: 8 * 3 }}>
    //         {props.children}
    //     </Typography>
    // );
    return (
        <React.Fragment>
            <DialogTitle id="responsive-dialog-title">
                {"Use Google's location service?"}
            </DialogTitle>

            <DialogContent>
                <DialogContentText>
                    Content of {props.children}
                </DialogContentText>
            </DialogContent>

            <DialogActions>
                <Button onClick={props.handleClose} color="primary">
                    Ok
                </Button>
                <Button onClick={props.handleClose} color="primary" autoFocus>
                    Cancel
                </Button>
            </DialogActions>
        </React.Fragment>
    )
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
};

const styles = {
    root: {
        flexGrow: 1,
    },
};

class TabsDemo extends React.Component {
    state = {
        value: 0,
    };

    handleChange = (event, value) => {
        this.setState({ value });
    };

    render() {
        const { classes, handleClose } = this.props;
        const {value} = this.state;


        return (
            <Paper className={classes.root}>
                <Tabs
                    value={value}
                    onChange={this.handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    centered
                >
                    <Tab label="Item One" />
                    <Tab label="Item Two" />
                    <Tab label="Item Three" />
                </Tabs>
                {value === 0 && (
                    <TabContainer handleClose={handleClose}>
                        Item One
                    </TabContainer>
                )}
                {value === 1 && (
                    <TabContainer handleClose={handleClose}>
                        Item Two
                    </TabContainer>
                )}
                {value === 2 && (
                    <TabContainer handleClose={handleClose}>
                        Item Three
                    </TabContainer>)
                }
            </Paper>
        );
    }
}

TabsDemo.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TabsDemo);
