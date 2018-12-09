import React from 'react';
import TextField from '@material-ui/core/TextField/TextField';
import PropTypes from 'prop-types';

const TextInput = ({ name, label, error, ...rest }) => {
    return (
        <TextField
            name={name}
            label={label}

            // fullWidth
            margin="normal" // TODO nessesary?

            error={error !== undefined}
            helperText={error}

            {...rest}
            // defaultValue="Default value"
        />
    );
};

TextInput.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.string,
};

export default TextInput;
