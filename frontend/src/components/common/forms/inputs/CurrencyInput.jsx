import React from 'react';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';
import TextField from '@material-ui/core/TextField/TextField';
import InputAdornment from '@material-ui/core/InputAdornment/InputAdornment';


const CurrencyInput = ({ name, label, currency, onChange, error, ...rest }) => {
    return (
        <NumberFormat
            autoComplete={name}

            name={name}
            label={label}

            onValueChange={({ value }) => onChange(value)}

            error={error !== undefined}
            helperText={error}

            {...rest}

            InputProps={{
                endAdornment: <InputAdornment position="end">{currency}</InputAdornment>,
            }}

            customInput={TextField}
            allowNegative={false}
            decimalScale={2}
            fixedDecimalScale={true}
        />
    );
};

CurrencyInput.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.string,

    autoFocus: PropTypes.bool.isRequired,
    margin: PropTypes.string.isRequired,
    className: PropTypes.string,

    currency: PropTypes.string.isRequired,
};

export default CurrencyInput;
