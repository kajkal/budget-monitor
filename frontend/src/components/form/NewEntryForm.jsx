import React from 'react';
import Form from '../common/form/Form';
import { DATE, DESCRIPTION, VALUE, ID_CATEGORY } from '../../config/fieldNames';
import Paper from '@material-ui/core/Paper/Paper';
import Joi from 'joi-browser';
import PropTypes from 'prop-types';

class NewEntryForm extends Form {
    state = {
        data: {
            [VALUE]: '',
            [DESCRIPTION]: '',
            [DATE]: '',
            [ID_CATEGORY]: '',
        },
        errors: {},
    };

    schema = {
        [VALUE]: Joi.number()
            .required()
            .positive()
            .max(1000000)
            .precision(2)
            .label('Value'),
        [DESCRIPTION]: Joi.string()
            .required()
            .label('Description'),
        [DATE]: Joi.date()
            .required()
            .min('1-1-2010')
            .label('Date'),
        [ID_CATEGORY]: Joi.string()
            .label('Category'),
    };

    componentDidMount() {
        const data = { ...this.state.data };
        data[DATE] = new Date().toISOString();
        this.setState({ data });
    }

    doSubmit = async () => {
        const {
            [VALUE]: value,
            [DESCRIPTION]: description,
            [DATE]: date,
            [ID_CATEGORY]: idCategory,
        } = this.state.data;

        console.log(`New entry submit: [val: ${value * 100}, description: ${description}, date: ${new Date(date).valueOf()}, idCategory: ${idCategory}]`);
        return;

        // try {
        //     console.log('send request to login');
        //     const { data } = this.state;
        //     // await auth.login(data[USERNAME], data[PASSWORD]);
        //
        //     console.log('login with success!');
        //
        //     const { state } = this.props.location;
        //     window.location = state ? state.from.pathname : '/';
        // } catch (e) {
        //     if (e.response && [400, 401].includes(e.response.status)) {
        //         console.log('messageKey: ', e.response.data.message);
        //         const errors = translateErrorMessage(e.response.data.message);
        //         console.log('translated errors: ', errors);
        //         this.setState({ errors });
        //     }
        // }
    };

    render() {
        const { currency, type } = this.props;
        const headerClassName = type === 'income' ? 'positive' : 'negative';

        return (
            <Paper className='form-container'>

                <h1>Add new <span className={headerClassName}>{type}</span></h1>

                <form onSubmit={this.handleSubmit} autoComplete='on'>
                    {this.renderCurrencyInput(VALUE, 'Value', currency, true)}
                    {this.renderTextInput(DESCRIPTION, 'Description')}
                    {this.renderDateTimeInput(DATE, 'Date')}
                    {this.renderTextInput(ID_CATEGORY, 'Category')}

                    {this.renderButton('Login')}
                </form>

            </Paper>
        );
    }
}

NewEntryForm.propTypes = {
    type: PropTypes.oneOf(['expense', 'income']).isRequired,
    currency: PropTypes.string.isRequired,
};

export default NewEntryForm;
