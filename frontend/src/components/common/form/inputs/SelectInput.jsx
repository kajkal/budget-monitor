import React from 'react';
import TextField from '@material-ui/core/TextField/TextField';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import { formInputFullWidth, formInputMargin } from '../../../../config/theme';
import PropTypes from 'prop-types';


const SelectInput = ({ name, label, options, error, ...rest }) => {
    return (
        <TextField
            select={true}
            autoComplete='on'

            name={name}
            label={label}

            error={error !== undefined}
            helperText={error}

            fullWidth={formInputFullWidth}
            margin={formInputMargin}

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
    options: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired
    })).isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.string
};

export default SelectInput;
