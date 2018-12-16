import React, { Component } from 'react';
import EntryForm from '../forms/EntryForm';


class New extends Component {
    render() {
        return (
            <EntryForm currency='PLN' type='expense'  onCancel={() => console.log('cancel')}/>
        );
    }
}

export default New;