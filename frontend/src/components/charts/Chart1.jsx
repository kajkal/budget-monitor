import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/es/Typography/Typography';
import { categoryShape, entryShape } from '../../config/propTypesCommon';


class Chart1 extends PureComponent {
    render() {
        return (
            <Typography variant='h4'>
                Chart 1
            </Typography>
        );
    }
}

Chart1.propTypes = {
    entries: PropTypes.arrayOf(entryShape),
    rootCategory: categoryShape,
    currency: PropTypes.string,
};

export default Chart1;
