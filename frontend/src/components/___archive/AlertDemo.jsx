import React, { Component } from 'react';
import Button from '@material-ui/core/Button/Button';
import { alertService } from '../../services/alertService';

class AlertDemo extends Component {
    render() {
        return (
            <React.Fragment>
                <h1>Snackbars Demo</h1>
                <Button onClick={() => alertService.default('Session expired')}>default</Button>
                <Button onClick={() => alertService.info('Display 134 entries')}>info</Button>
                <Button onClick={() => alertService.success('Entry successfully updated')}>success</Button>
                <Button onClick={() => alertService.warning('Failed fetching data')}>warning</Button>
                <Button onClick={() => alertService.error('Session expired')}>error</Button>
            </React.Fragment>
        );
    }
}

export default AlertDemo;
