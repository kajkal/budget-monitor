import React from 'react';
import Form from '../common/form/Form';
import { VALUE, DESCRIPTION, DATE, ID_CATEGORY } from '../../config/fieldNames';
import Paper from '@material-ui/core/Paper/Paper';
import Joi from 'joi-browser';
import auth from '../../services/authService';
import { translateErrorMessage } from '../../services/errorMessageService';

class NewEntryForm extends Form {
    state = {
        data: {
            [VALUE]: '',
            [DESCRIPTION]: '',
            // [DATE]: '',
            // [ID_CATEGORY]: ''
        },
        errors: {}
    };

    schema = {
        [VALUE]: Joi.number()
            .required()
            .positive()
            .precision(2)
            .label('Value'),
        [DESCRIPTION]: Joi.string()
            .required()
            .label('Description')
    };

    doSubmit = async () => {
        return;
        try {
            console.log('send request to login');
            const { data } = this.state;
            // await auth.login(data[USERNAME], data[PASSWORD]);

            console.log('login with success!');

            const {state} = this.props.location;
            window.location = state ? state.from.pathname : '/';
        } catch (e) {
            if (e.response && [400, 401].includes(e.response.status)) {
                console.log('messageKey: ', e.response.data.message);
                const errors = translateErrorMessage(e.response.data.message);
                console.log('translated errors: ', errors);
                this.setState({ errors });
            }
        }
    };

    render() {
        const type = 'expense';
        return (
            <Paper className='form-container'>

                <h1>Add new <mark className='positive' style={{backgroundColor: 'transparent'}}>{type}</mark></h1>

                <form onSubmit={this.handleSubmit} autoComplete='on'>
                    {this.renderCurrencyInput(VALUE, 'Value', true)}
                    {this.renderTextInput(DESCRIPTION, 'Description')}
                    {this.renderButton('Login')}
                </form>

            </Paper>
        );
    }
}

export default NewEntryForm;