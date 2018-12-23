import React, { PureComponent } from 'react';
import { Delete, Edit, ExpandMore } from '@material-ui/icons';
import ExpansionPanel from '@material-ui/core/es/ExpansionPanel/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/es/ExpansionPanelSummary/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/es/ExpansionPanelDetails/ExpansionPanelDetails';
import { categoryShape, entryShape } from '../../config/propTypesCommon';
import { DateTime } from 'luxon';
import { getCategoryByIdCategory } from '../../services/entities-services/categoryService';
import PropTypes from 'prop-types';
import ExpansionPanelActions from '@material-ui/core/es/ExpansionPanelActions/ExpansionPanelActions';
import Button from '@material-ui/core/es/Button/Button';
import ListItemIcon from '@material-ui/core/es/ListItemIcon/ListItemIcon';
import EntryDeleteForm from '../forms/EntryDeleteForm';
import EntryForm from '../forms/EntryForm';


class EntryDataRow extends PureComponent {
    state = {
        open: false,
        operationType: null,
    };

    formatValue = (value, currency) => {
        const valueType = value > 0 ? 'positive' : '';
        return (
            <div className='value'>
                <span className={valueType}>{(value / 100).toFixed(2)}</span>
                <span className='currency'>{currency}</span>
            </div>
        );
    };

    renderSubEntry = (subEntry, currency) => {
        const { idSubEntry, value, description, idCategory } = subEntry;
        const category = getCategoryByIdCategory(idCategory);

        return (
            <React.Fragment key={idSubEntry}>
                {this.formatValue(value, currency)}
                <div className='category'>{category && category.name}</div>
                <div className='description'>{description}</div>

            </React.Fragment>
        );
    };

    renderEntrySummary = (entry, currency) => {
        const { fullDate } = this.props;
        const { date, idCategory, description, value } = entry;
        const time = date.toLocaleString(fullDate ? DateTime.DATETIME_MED :DateTime.TIME_SIMPLE);
        const category = getCategoryByIdCategory(idCategory);

        return (
            <ExpansionPanelSummary expandIcon={<ExpandMore />}>

                <div className='entry-row-summary'>
                    <div className='time'>{time}</div>
                    {category && <div className='category'>{category.name}</div>}
                    <div className='description'>{description}</div>
                    {this.formatValue(value, currency)}
                </div>

            </ExpansionPanelSummary>
        );
    };

    renderEntryDetails = (entry, currency) => {
        const { subEntries, dateOfAddition, dateOfLastModification } = entry;
        const additionDate = DateTime.fromMillis(dateOfAddition).toLocaleString(DateTime.DATETIME_MED);
        const modificationDate = (dateOfAddition !== dateOfLastModification) ?
            DateTime.fromMillis(dateOfLastModification).toLocaleString(DateTime.DATETIME_MED) : null;

        return (
            <ExpansionPanelDetails>

                <div className='entry-row-details'>
                    <div className='addition-date'>Added: {additionDate}</div>
                    {modificationDate && <div className='last-modification-date'>Modified: {modificationDate}</div>}
                    {
                        subEntries.length > 0 && (
                            <div className='sub-entries-area'>
                                {subEntries.map(subEntry => this.renderSubEntry(subEntry, currency))}
                            </div>
                        )
                    }
                </div>

            </ExpansionPanelDetails>
        );
    };

    renderEntryOptions = () => {
        return (
            <ExpansionPanelActions>
                <Button size='small' onClick={() => this.setState({ operationType: 'delete' })}>
                    <ListItemIcon className='m-0'>
                        <Delete />
                    </ListItemIcon>
                    Delete
                </Button>
                <Button size='small' onClick={() => this.setState({ operationType: 'edit' })}>
                    <ListItemIcon className='m-0'>
                        <Edit />
                    </ListItemIcon>
                    Edit
                </Button>
            </ExpansionPanelActions>
        );
    };


    handleEntryFormClose = () => {
        this.setState({ operationType: null });
    };

    renderDeleteEntryDialog = operationType => {
        if (operationType !== 'delete') return null;
        const { entry, onEntriesChange } = this.props;
        return (
            <EntryDeleteForm
                entry={entry}
                open={Boolean(entry)}
                onClose={this.handleEntryFormClose}
                onEntriesChange={onEntriesChange}
            />
        );
    };

    renderEditEntryDialog = operationType => {
        if (operationType !== 'edit') return null;
        const { entry, rootCategory, currency, onEntriesChange } = this.props;
        const type = entry.value > 0 ? 'income' : 'expense';
        return (
            <EntryForm
                type={type}
                currency={currency}
                rootCategory={rootCategory}
                entry={entry}
                open={Boolean(entry)}
                onClose={this.handleEntryFormClose}
                onEntriesChange={onEntriesChange}
            />
        );
    };

    render() {
        const { open, operationType } = this.state;
        const { entry, currency } = this.props;

        return (
            <ExpansionPanel
                expanded={open}
                onChange={() => this.setState(state => ({ open: !state.open }))}
            >

                {this.renderEntrySummary(entry, currency)}
                {open && this.renderEntryDetails(entry, currency)}
                {open && this.renderEntryOptions()}

                {open && this.renderDeleteEntryDialog(operationType)}
                {open && this.renderEditEntryDialog(operationType)}

            </ExpansionPanel>
        );
    }
}

EntryDataRow.propTypes = {
    entry: entryShape.isRequired,
    fullDate: PropTypes.bool,
    rootCategory: categoryShape,
    currency: PropTypes.string.isRequired,
    onEntriesChange: PropTypes.func.isRequired,
};

export default EntryDataRow;
