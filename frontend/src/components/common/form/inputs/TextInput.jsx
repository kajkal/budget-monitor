import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField/TextField';
import { formInputFullWidth, formInputMargin } from '../../../../config/theme';


const TextInput = ({ name, label, onChange, error, ...rest }) => {
    return (
        <TextField
            autoComplete={name}

            name={name}
            label={label}

            onChange={({ target: { value } }) => onChange(value)}

            error={error !== undefined}
            helperText={error}

            fullWidth={formInputFullWidth}
            margin={formInputMargin}

            {...rest}
        />
    );
};

TextInput.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    className: PropTypes.string,
    error: PropTypes.string,
};

export default TextInput;
