import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import LinearProgress from '@material-ui/core/es/LinearProgress/LinearProgress';
import Typography from '@material-ui/core/es/Typography/Typography';
import EntryDataRow from './EntryDataRow';
import { sort } from '../../services/entities-services/entryService';
import { categoryRootShape, entryShape } from '../../config/propTypesCommon';


class EntryRecent extends PureComponent {

    componentDidMount() {
        console.log('componentDidMount, fetch recent data');
        this.props.getRecentEntries();
    }

    render() {
        const { recentEntries, rootCategory, currency, onEntriesChange } = this.props;

        if (!recentEntries || !rootCategory || !currency) return <LinearProgress />;

        const sortedRecentEntries = sort(recentEntries, 'dateOfLastModification', 'desc');
        return (
            <div className='entry-register recent'>
                {
                    <Typography component={'div'}>

                        <div className='entries-for-day header'>
                            Recent entries
                        </div>

                        {
                            sortedRecentEntries.map(entry => (
                                <EntryDataRow
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

EntryRecent.propTypes = {
    recentEntries: PropTypes.arrayOf(entryShape),
    rootCategory: categoryRootShape,
    currency: PropTypes.string,
    getRecentEntries: PropTypes.func.isRequired,
    onEntriesChange: PropTypes.func.isRequired,
};

export default EntryRecent;
