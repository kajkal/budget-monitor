import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper/Paper';
import DialogDemo from './DialogDemo';

class Playground extends Component {

    render() {
        const {error} = this.props;
        return (
            <div>
                <Paper>
                    {/*<TabsDemo/>*/}
                    <DialogDemo/>
                </Paper>
            </div>
        );
    }
}

export default Playground;