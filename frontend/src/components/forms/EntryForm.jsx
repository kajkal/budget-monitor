import React from 'react';
import PropTypes from 'prop-types';
import Joi from 'joi-browser';
import { DateTime } from 'luxon';
import _ from 'lodash';
import { Add, Delete } from '@material-ui/icons';
import Button from '@material-ui/core/Button/Button';
import { addEntry, updateEntry } from '../../services/entities-services/entryService';
import Form from '../common/forms/Form';
import { CATEGORY, DATE, DESCRIPTION, SUB_ENTRIES, VALUE } from '../../config/fieldNames';
import { translateErrorMessage } from '../../services/errorMessageService';
import { alertService } from '../../services/alertService';
import { categoryShape, entryShape } from '../../config/propTypesCommon';
import { getCategoriesByType, getCategoryByIdCategory } from '../../services/entities-services/categoryService';
import withMobileDialog from '@material-ui/core/es/withMobileDialog/withMobileDialog';
import Dialog from '@material-ui/core/Dialog/Dialog';
import DialogActions from '@material-ui/core/es/DialogActions/DialogActions';
import DialogContent from '@material-ui/core/es/DialogContent/DialogContent';
import DialogTitle from '@material-ui/core/es/DialogTitle/DialogTitle';
import { desktopDialogMaxWidth, mobileDialogBreakpoint } from '../../config/theme';


class EntryForm extends Form {
    state = {
        data: {
            [VALUE]: '',
            [DESCRIPTION]: '',
            [DATE]: '',
            [CATEGORY]: {},
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
        [DATE]: Joi.string()
            .required()
            .label('Date'),
        [CATEGORY]: Joi.object()
            .label('Category'),
    };

    validationIgnoreList = [CATEGORY];

    componentDidMount() {
        const data = { ...this.state.data };
        const { entry } = this.props;

        if (entry) {
            data[VALUE] = (Math.abs(entry.value / 100)).toString();
            data[DESCRIPTION] = entry.description;
            data[DATE] = entry.date.toISO();
            data[CATEGORY] = getCategoryByIdCategory(entry.idCategory) || {};
            data[SUB_ENTRIES] = entry.subEntries.map(subEntry => ({
                [VALUE]: (Math.abs(subEntry.value / 100)).toString(),
                [DESCRIPTION]: subEntry.description,
                [CATEGORY]: getCategoryByIdCategory(subEntry.idCategory) || {},
            }));
        } else {
            data[DATE] = DateTime.local().toISO();
        }
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
        if (_.isEqual(path, [CATEGORY])) {
            const newMainCategory = data[CATEGORY];
            const { [SUB_ENTRIES]: subEntries } = data;
            if (newMainCategory) {
                Object.values(subEntries)
                    .filter(se => !_.isEmpty(se[CATEGORY]))
                    .filter(se => !(se[CATEGORY].path && se[CATEGORY].path.includes(newMainCategory.idCategory)))
                    .forEach(se => se[CATEGORY] = {});

                // Object.values(subEntries)
                //     .filter(se => _.isEmpty(se[CATEGORY]))
                //     .forEach(se => se[CATEGORY] = newMainCategory)
            }
        }
    };

    doSubmit = async () => {
        const { data } = this.state;
        const { entry, type, onClose, onEntriesChange } = this.props;
        try {
            if (entry) {
                const { data: response } = await updateEntry(entry.idEntry, data, type);
                alertService.success('Entry successfully updated.');
                onClose();
                onEntriesChange(response, 'edit');
            } else {
                const { data: response } = await addEntry(data, type);
                alertService.success('Entry successfully added.');
                onClose();
                onEntriesChange(response, 'add');
            }
        } catch (e) {
            if (e.response && [400, 401, 403].includes(e.response.status)) {
                const errors = translateErrorMessage(e.response.data.message);
                this.setState({ errors });
            }
        }
    };

    handleAddSubEntry = () => {
        const data = { ...this.state.data };
        data[SUB_ENTRIES][new Date().valueOf()] = {
            [VALUE]: '',
            [DESCRIPTION]: '',
            [CATEGORY]: data[CATEGORY],
        };
        this.setState({ data });
    };

    handleRemoveSubEntry = id => () => {
        const data = { ...this.state.data };
        const newEntryValue = data[VALUE] ? data[VALUE] - Number(data[SUB_ENTRIES][id][VALUE]) : data[VALUE];
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
        const { currency, type, rootCategory } = this.props;
        const { [SUB_ENTRIES]: subEntries, [CATEGORY]: category } = this.state.data;

        if (subEntries) {
            return (
                <div className='subEntry-area'>
                    {
                        Object.keys(subEntries).map(id => {
                            const path = [SUB_ENTRIES, id];
                            const categoryDetails = {
                                rootCategory: _.isEmpty(category) ? getCategoriesByType(rootCategory, type) : category,
                                onlySubCategories: _.isEmpty(category),
                                header: null,
                            };
                            return (
                                <div key={id} className='subEntry-row'>
                                    {this.renderCurrencyInput([...path, VALUE], 'Value', {currency},
                                        {className: 'currency-input', margin: 'dense'})}
                                    {this.renderTextInput([...path, DESCRIPTION], 'Description', {},
                                        {className: 'description-input', margin: 'dense'})}
                                    {this.renderCategoryInput([...path, CATEGORY], 'Sub category', categoryDetails,
                                        {className: 'category-input', margin: 'dense'})}
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
        const { entry, currency, type, rootCategory, open, onClose, fullScreen } = this.props;
        const headerClassName = type === 'income' ? 'positive' : 'negative';
        const formTitle = entry ? 'Edit ' : 'Add new';
        const submitButtonTitle = entry ? 'Save' : 'Add';

        const categoryDetails = {
            rootCategory: getCategoriesByType(rootCategory, type),
            onlySubCategories: true,
            header: null,
        };

        return (
            <Dialog
                fullScreen={fullScreen}
                scroll={'body'}
                maxWidth={desktopDialogMaxWidth}
                fullWidth={true}

                open={open}
                onClose={onClose}
                disableBackdropClick={true}
                aria-labelledby='entry-form-dialog'
            >

                <DialogTitle
                    id='entry-form-dialog'
                    className='form-header'
                    disableTypography={true}
                >
                    {formTitle} <span className={headerClassName}>{type}</span>
                </DialogTitle>

                <DialogContent>
                    <form autoComplete='on' onKeyDown={this.onEnterDown}>

                        <div className='form-content new-entry-form'>
                            {this.renderCurrencyInput([VALUE], 'Value', {currency}, {className: 'currency-input', focus: true})}
                            {this.renderCategoryInput([CATEGORY], 'Category', categoryDetails, {className: 'category-input'})}
                            {this.renderTextInput([DESCRIPTION], 'Description', {}, {className: 'description-input'})}
                            {this.renderDateTimeInput([DATE], 'Date', {}, {className: 'date-input'})}

                            {this.renderSubEntriesArea()}
                            {this.renderNewSubEntryButton()}
                        </div>

                    </form>
                </DialogContent>

                <DialogActions>
                    {this.renderCancelButton(onClose)}
                    {this.renderSubmitButton(submitButtonTitle)}
                </DialogActions>

            </Dialog>
        );
    }
}

EntryForm.propTypes = {
    type: PropTypes.oneOf(['expense', 'income']).isRequired,
    currency: PropTypes.string.isRequired,
    rootCategory: categoryShape.isRequired,
    entry: entryShape,

    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onEntriesChange: PropTypes.func.isRequired,

    fullScreen: PropTypes.bool.isRequired,
};

export default withMobileDialog({ breakpoint: mobileDialogBreakpoint })(EntryForm);
