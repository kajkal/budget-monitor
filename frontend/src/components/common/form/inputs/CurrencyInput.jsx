import React from 'react';
import PropTypes from 'prop-types';
import TextInput from './TextInput';
import NumberFormat from 'react-number-format';
import TextField from '@material-ui/core/TextField/TextField';
import InputAdornment from '@material-ui/core/InputAdornment/InputAdornment';
import { formInputFullWidth, formInputMargin } from '../../../../config/theme';


const CurrencyInput = ({ name, label, currency, onChange, error, ...rest }) => {
    return (
        <NumberFormat
            autoComplete={name}

            name={name}
            label={label}

            onValueChange={({ value }) => onChange(value)}

            error={error !== undefined}
            helperText={error}

            fullWidth={formInputFullWidth}
            margin={formInputMargin}

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

TextInput.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    currency: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    error: PropTypes.string,
};

export default CurrencyInput;
