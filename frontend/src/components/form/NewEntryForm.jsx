import React from 'react';
import PropTypes from 'prop-types';
import Joi from 'joi-browser';
import _ from 'lodash';
import { Add, Delete } from '@material-ui/icons';
import Paper from '@material-ui/core/Paper/Paper';
import Button from '@material-ui/core/Button/Button';
import Form from '../common/form/Form';
import { DATE, DESCRIPTION, ID_CATEGORY, SUBENTRIES, VALUE } from '../../config/fieldNames';

class NewEntryForm extends Form {
    state = {
        data: {
            [VALUE]: '',
            [DESCRIPTION]: '',
            [DATE]: '',
            [ID_CATEGORY]: '',
            [SUBENTRIES]: {},
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
            .iso()
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
            [SUBENTRIES]: subEntries,
        } = this.state.data;

        console.log(`New entry submit: [val: ${value * 100}, description: ${description}, date: ${new Date(date).valueOf()}, idCategory: ${idCategory}]`);
        const parsedSubEntries = [];
        _.forOwn(subEntries, value => parsedSubEntries.push({ value }));
        console.log('subentries: ', parsedSubEntries);

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

    handleAddSubEntry = () => {
        const data = { ...this.state.data };
        data[SUBENTRIES][new Date().valueOf()] = {
            [VALUE]: '',
            [DESCRIPTION]: '',
            [ID_CATEGORY]: '',
        };
        this.setState({ data });
    };

    handleRemoveSubEntry = id => () => {
        const data = { ...this.state.data };
        delete data[SUBENTRIES][id];
        this.setState({ data });
    };

    renderNewSubEntryButton = () => {
        return (
            <Button size='small' className='new-subEntry-btn' onClick={this.handleAddSubEntry}>
                <Add /> Add sub entry
            </Button>
        );
    };

    renderSubEntriesArea = () => {
        const { currency } = this.props;
        const { [SUBENTRIES]: subEntries } = this.state.data;

        if (subEntries) {
            return (
                <div className='subEntry-area'>
                    {
                        Object.keys(subEntries).map(id => {
                            const path = [SUBENTRIES, id];
                            return (
                                <div key={id} className='subEntry-row'>
                                    {this.renderCurrencyInput([...path, VALUE], 'Value', currency, 'currency-input', false, 'dense')}
                                    {this.renderTextInput([...path, DESCRIPTION], 'Description', 'description-input', false, 'dense')}
                                    {this.renderTextInput([...path, ID_CATEGORY], 'Category', 'category-input', false, 'dense')}
                                    {this.renderIconButton(
                                        <Delete />, this.handleRemoveSubEntry(id), 'Remove sub entry', 'remove-subEntry-btn'
                                    )}
                                </div>
                            );
                        })
                    }
                </div>
            );
        }
    };

    render() {
        const { currency, type, onCancel } = this.props;
        const headerClassName = type === 'income' ? 'positive' : 'negative';

        return (
            <Paper className='form-container'>

                <form onSubmit={this.handleSubmit} autoComplete='on'>
                    <header>
                        Add new <span className={headerClassName}>{type}</span>
                    </header>

                    <div className='form-content new-entry-form'>
                        {this.renderCurrencyInput([VALUE], 'Value', currency, 'currency-input', true)}
                        {this.renderTextInput([ID_CATEGORY], 'Category', 'category-input')}
                        {this.renderTextInput([DESCRIPTION], 'Description', 'description-input')}
                        {this.renderDateTimeInput([DATE], 'Date', 'date-input')}

                        {this.renderSubEntriesArea()}
                        {this.renderNewSubEntryButton()}
                    </div>

                    <footer>
                        {this.renderCancelButton(onCancel)}
                        {this.renderSubmitButton('Add')}
                    </footer>
                </form>

            </Paper>
        );
    }
}

NewEntryForm.propTypes = {
    type: PropTypes.oneOf(['expense', 'income']).isRequired,
    currency: PropTypes.string.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export default NewEntryForm;
