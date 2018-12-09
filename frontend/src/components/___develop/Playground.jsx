import React, { Component } from 'react';
import Test from './ReactSelect';
import Paper from '@material-ui/core/Paper/Paper';

class Playground extends Component {

    render() {
        const {error} = this.props;
        return (
            <div>
                <Paper style={{width: 350, padding: 20}}>
                    <div style={{height: 50}}>hello</div>
                    <Test/>
                </Paper>
            </div>
        );
    }
}

export default Playground;