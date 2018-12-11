import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper/Paper';
import DialogDemo from './DialogDemo';
import CategoryListDemo from './CategoryListDemo';

class Playground extends Component {

    render() {
        return (
            <div>
                <Paper>
                    {/*<TabsDemo/>*/}
                    {/*<DialogDemo/>*/}
                    <CategoryListDemo/>
                </Paper>
            </div>
        );
    }
}

export default Playground;
