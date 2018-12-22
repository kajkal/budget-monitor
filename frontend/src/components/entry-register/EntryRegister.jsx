import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import EntryDataRow from './EntryDataRow';
import Typography from '@material-ui/core/es/Typography/Typography';
import { DateTime } from 'luxon';
import { categoryRootShape, entryShape } from '../../config/propTypesCommon';


class EntryRegister extends PureComponent {

    render() {
        const { entriesByDay, rootCategory, currency } = this.props;
        if (!entriesByDay || !rootCategory || !currency) return null;

        console.log("DateTime", DateTime);
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
                                    <EntryDataRow key={entry.idEntry} entry={entry} currency={currency}/>
                                ))
                            }
                        </Typography>
                    ))
                }

            </div>
        );
    }
}

EntryRegister.propTypes = {
    entriesByDay: PropTypes.arrayOf(
        PropTypes.shape({
            day: PropTypes.object.isRequired,
            entries: PropTypes.arrayOf(entryShape),
        }).isRequired,
    ),
    rootCategory: categoryRootShape,
    currency: PropTypes.string,
};

export default EntryRegister;
