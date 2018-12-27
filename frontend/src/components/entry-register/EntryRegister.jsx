import React from 'react';
import PropTypes from 'prop-types';
import EntryDataRow from './EntryDataRow';
import Typography from '@material-ui/core/es/Typography/Typography';
import { categoryShape, entryShape } from '../../config/propTypesCommon';


const EntryRegister = ({ entriesByDay, rootCategory, currency, onEntriesChange }) => {

    if (!entriesByDay || entriesByDay.length === 0 || !rootCategory || !currency)
        return <h1 style={{ margin: '64px' }}>No data to display</h1>;
    return (
        <div className='entry-register'>
            {
                entriesByDay.map(({day, entries}) => (
                    <Typography component={'div'} key={day}>

                        <div className='entries-for-day header'>
                            {day.toFormat('dd MMMM yyyy, cccc')}
                        </div>

                        {
                            entries.map(entry => (
                                <EntryDataRow
                                    key={entry.idEntry}
                                    entry={entry}
                                    rootCategory={rootCategory}
                                    currency={currency}
                                    onEntriesChange={onEntriesChange}
                                />
                            ))
                        }
                    </Typography>
                ))
            }
        </div>
    );
};

EntryRegister.propTypes = {
    entriesByDay: PropTypes.arrayOf(
        PropTypes.shape({
            day: PropTypes.object.isRequired,
            entries: PropTypes.arrayOf(entryShape),
        }).isRequired,
    ),
    rootCategory: categoryShape,
    currency: PropTypes.string,
    onEntriesChange: PropTypes.func.isRequired,
};

export default EntryRegister;
