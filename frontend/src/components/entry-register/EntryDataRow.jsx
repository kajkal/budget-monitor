import React, { PureComponent } from 'react';
import { Delete, Edit, ExpandMore } from '@material-ui/icons';
import ExpansionPanel from '@material-ui/core/es/ExpansionPanel/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/es/ExpansionPanelSummary/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/es/ExpansionPanelDetails/ExpansionPanelDetails';
import { entryShape } from '../../config/propTypesCommon';
import { DateTime } from 'luxon';
import { getCategoryByIdCategory } from '../../services/entities-services/categoryService';
import PropTypes from 'prop-types';
import ExpansionPanelActions from '@material-ui/core/es/ExpansionPanelActions/ExpansionPanelActions';
import Button from '@material-ui/core/es/Button/Button';
import ListItemIcon from '@material-ui/core/es/ListItemIcon/ListItemIcon';


class EntryDataRow extends PureComponent {
    state = {
        open: false,
    };

    formatValue = (value, currency) => {
        return (
            <React.Fragment>
                {(value / 100).toFixed(2)}
                <span className='currency'>{currency}</span>
            </React.Fragment>
        );
    };

    renderSubEntry = (subEntry, currency) => {
        const { idSubEntry, value, description, idCategory } = subEntry;
        const category = getCategoryByIdCategory(idCategory);
        const entryType = value > 0 ? 'positive' : '';

        return (
            <React.Fragment key={idSubEntry}>
                <div className={`value ${entryType}`}>{this.formatValue(value, currency)}</div>
                <div className='category'>{category && category.name}</div>
                <div className='description'>{description}</div>

            </React.Fragment>
        );
    };

    renderEntrySummary = (entry, currency) => {
        const { date, idCategory, description, value } = entry;
        const time = date.toLocaleString(DateTime.TIME_SIMPLE);
        const category = getCategoryByIdCategory(idCategory);
        const entryType = value > 0 ? 'positive' : '';

        return (
            <ExpansionPanelSummary expandIcon={<ExpandMore />}>

                <div className='entry-row-summary'>
                    <div className='time'>{time}</div>
                    <div className='category'>{category && category.name}</div>
                    <div className='description'>{description}</div>
                    <div className={`value ${entryType}`}>{this.formatValue(value, currency)}</div>
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

    renderEntryOptions = (entry) => {
        return (
            <ExpansionPanelActions>
                <Button size='small' onClick={() => console.log(entry)}>
                    <ListItemIcon className='m-0'>
                        <Delete />
                    </ListItemIcon>
                    Delete
                </Button>
                <Button size='small'>
                    <ListItemIcon className='m-0'>
                        <Edit />
                    </ListItemIcon>
                    Edit
                </Button>
            </ExpansionPanelActions>
        );
    };

    render() {
        const { open } = this.state;
        const { entry, currency } = this.props;

        return (
            <ExpansionPanel
                expanded={open}
                onChange={() => this.setState(state => ({ open: !state.open }))}
            >

                {this.renderEntrySummary(entry, currency)}

                {open && this.renderEntryDetails(entry, currency)}

                {open && this.renderEntryOptions(entry)}

            </ExpansionPanel>
        );
    }
}

EntryDataRow.propTypes = {
    entry: entryShape.isRequired,
    currency: PropTypes.string.isRequired,
};

export default EntryDataRow;
