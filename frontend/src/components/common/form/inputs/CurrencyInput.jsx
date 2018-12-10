import React from 'react';
import PropTypes from 'prop-types';
import TextInput from './TextInput';
import NumberFormat from "react-number-format";
import TextField from '@material-ui/core/TextField/TextField';
import InputAdornment from '@material-ui/core/InputAdornment/InputAdornment';
import { formInputFullWidth, formInputMargin } from '../../../../config/theme';

const CurrencyInput = ({ name, label, error, ...rest }) => {
    return (
        <NumberFormat
            autoComplete={name}

            name={name}
            label={label}

            error={error !== undefined}
            helperText={error}

            fullWidth={formInputFullWidth}
            margin={formInputMargin}

            {...rest}
            // TODO: stay?
            InputProps={{
                endAdornment: <InputAdornment position="end">PLN</InputAdornment>,
            }}

            customInput={TextField}
            // TODO change onChange to onValueChange
            // onChange={({target}) => console.log('target', target.value)}
            // onValueChange={values => console.log('values', values)}
            allowNegative={false}
            decimalScale={2}
            fixedDecimalScale={true}
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

export default CurrencyInput;
