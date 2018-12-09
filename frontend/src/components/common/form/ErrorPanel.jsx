import React from 'react';
import PropTypes from 'prop-types';

const ErrorPanel = ({ message }) => {
    return (
        <h5 className='error-message'>
            {message}
        </h5>
    );
};

ErrorPanel.propTypes = {
    message: PropTypes.string.isRequired,
};

export default ErrorPanel;
