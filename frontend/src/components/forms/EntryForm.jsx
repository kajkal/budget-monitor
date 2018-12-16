import React from 'react';
import PropTypes from 'prop-types';
import Joi from 'joi-browser';
import { DateTime } from 'luxon';
import _ from 'lodash';
import { Add, Delete } from '@material-ui/icons';
import Paper from '@material-ui/core/Paper/Paper';
import Button from '@material-ui/core/Button/Button';
import { addEntry } from '../../services/entities-services/entryService';
import Form from '../common/forms/Form';
import { DATE, DESCRIPTION, ID_CATEGORY, SUB_ENTRIES, VALUE } from '../../config/fieldNames';
import { translateErrorMessage } from '../../services/errorMessageService';
import { alertService } from '../../services/alertService';


class EntryForm extends Form {
    state = {
        data: {
            [VALUE]: '',
            [DESCRIPTION]: '',
            [DATE]: '',
            [ID_CATEGORY]: '',
            [SUB_ENTRIES]: {},
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
            .raw()
            .label('Date'),
        [ID_CATEGORY]: Joi.string()
            .empty('')
            .label('Category'),
    };

    componentDidMount() {
        const data = { ...this.state.data };
        data[DATE] = DateTime.local().toISO();
        this.setState({ data });
    }

    extendedOnInputChange = (path, data) => {
        if (_.last(path) === VALUE) {
            const { [VALUE]: value, [SUB_ENTRIES]: subEntries } = data;
            const subEntriesValues = Object.values(subEntries).map(subEntry => subEntry[VALUE]);
            const sumOfSubEntriesValues = subEntriesValues.reduce((a, b) => Number(a) + Number(b), 0);

            if (Number(value) < sumOfSubEntriesValues)
                data[VALUE] = sumOfSubEntriesValues.toString();
        }
    };

    doSubmit = async () => {
        try {
            const response = await addEntry(this.state.data, this.props.type);

            console.log('response from server: ', response);
            alertService.success('Entry successfully added.');
            this.props.onCancel();
        } catch (e) {
            if (e.response && [400, 401, 403].includes(e.response.status)) {
                console.log('messageKey: ', e.response.data.message);
                const errors = translateErrorMessage(e.response.data.message);
                console.log('translated errors: ', errors);
                this.setState({ errors });
            }
        }
    };

    handleAddSubEntry = () => {
        const data = { ...this.state.data };
        data[SUB_ENTRIES][new Date().valueOf()] = {
            [VALUE]: '',
            [DESCRIPTION]: '',
            [ID_CATEGORY]: '',
        };
        this.setState({ data });
    };

    handleRemoveSubEntry = id => () => {
        const data = { ...this.state.data };
        const newEntryValue = data[VALUE] - Number(data[SUB_ENTRIES][id][VALUE]);
        data[VALUE] = newEntryValue.toString();
        delete data[SUB_ENTRIES][id];
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
        const { [SUB_ENTRIES]: subEntries } = this.state.data;

        if (subEntries) {
            return (
                <div className='subEntry-area'>
                    {
                        Object.keys(subEntries).map(id => {
                            const path = [SUB_ENTRIES, id];
                            return (
                                <Paper key={id} className='subEntry-row'>
                                    {this.renderCurrencyInput([...path, VALUE], 'Value', currency, 'currency-input', false, 'dense')}
                                    {this.renderTextInput([...path, DESCRIPTION], 'Description', 'description-input', false, 'dense')}
                                    {this.renderTextInput([...path, ID_CATEGORY], 'Sub category', 'category-input', false, 'dense')}
                                    {this.renderIconButton(
                                        <Delete />, this.handleRemoveSubEntry(id), 'Remove sub entry', 'remove-subEntry-btn'
                                    )}
                                </Paper>
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
        );
    }
}

EntryForm.propTypes = {
    type: PropTypes.oneOf(['expense', 'income']).isRequired,
    currency: PropTypes.string.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export default EntryForm;
