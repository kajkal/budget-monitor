import React, { Component } from 'react';
import NewEntryForm from '../form/NewEntryForm';


class New extends Component {
    render() {
        return (
            <NewEntryForm currency='PLN' type='expense' />
        );
    }
}

export default New;