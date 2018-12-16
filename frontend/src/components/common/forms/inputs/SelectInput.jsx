import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField/TextField';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';


const SelectInput = ({ name, label, options, onChange, error, ...rest }) => {
    return (
        <TextField
            select={true}
            autoComplete={name}

            name={name}
            label={label}

            onChange={({ target: { value } }) => onChange(value)}

            error={error !== undefined}
            helperText={error}

            {...rest}
        >
            {options.map(option => (
                <MenuItem key={option.value} value={option.value}>
                    {option.label}
                </MenuItem>
            ))}
        </TextField>
    );
};

SelectInput.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
        }),
    ).isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    margin: PropTypes.string.isRequired,
    autoFocus: PropTypes.bool.isRequired,
    className: PropTypes.string,
    error: PropTypes.string,
};

export default SelectInput;
