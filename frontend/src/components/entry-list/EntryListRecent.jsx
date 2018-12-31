import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/es/Typography/Typography';
import EntryListItem from './EntryListItem';
import { sort } from '../../services/entities-services/entryService';
import { categoryShape, entryShape } from '../../config/propTypesCommon';


class EntryListRecent extends PureComponent {

    componentDidMount() {
        this.props.getRecentEntries();
    }

    render() {
        const { recentEntries, rootCategory, currency, onEntriesChange } = this.props;

        if (!recentEntries || recentEntries.length === 0 || !rootCategory || !currency)
            return <h1 style={{ marginTop: '64px' }}>No data to display</h1>;

        const sortedRecentEntries = sort(recentEntries, 'dateOfLastModification', 'desc');
        return (
            <div className='entry-list recent'>
                {
                    <Typography component={'div'}>

                        <div className='entries-for-day header'>
                            Recent entries
                        </div>

                        {
                            sortedRecentEntries.map(entry => (
                                <EntryListItem
                                    key={entry.idEntry}
                                    entry={entry}
                                    fullDate={true}
                                    rootCategory={rootCategory}
                                    currency={currency}
                                    onEntriesChange={onEntriesChange}
                                />
                            ))
                        }
                    </Typography>
                }
            </div>
        );
    }
}

EntryListRecent.propTypes = {
    recentEntries: PropTypes.arrayOf(entryShape),
    rootCategory: categoryShape,
    currency: PropTypes.string,
    getRecentEntries: PropTypes.func.isRequired,
    onEntriesChange: PropTypes.func.isRequired,
};

export default EntryListRecent;
