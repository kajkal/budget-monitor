import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField/TextField';


const TextInput = ({ name, label, onChange, error, ...rest }) => {
    return (
        <TextField
            autoComplete={name}

            name={name}
            label={label}

            onChange={({ target: { value } }) => onChange(value)}

            error={error !== undefined}
            helperText={error}

            {...rest}
        />
    );
};

TextInput.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    margin: PropTypes.string.isRequired,
    autoFocus: PropTypes.bool.isRequired,
    className: PropTypes.string,
    error: PropTypes.string,
};

export default TextInput;
