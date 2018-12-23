import React from 'react';
import PropTypes from 'prop-types';
import { DatePicker  } from 'material-ui-pickers';
import { CalendarToday, KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';


const DateInput = ({ name, label, onChange, error, ...rest }) => {
    return (
        <DatePicker
            name={name}
            label={label}

            onChange={date => onChange(date.toISO())}

            error={error !== undefined}
            helperText={error}

            {...rest}

            autoOk={true}

            leftArrowIcon={<KeyboardArrowLeft />}
            rightArrowIcon={<KeyboardArrowRight />}
            keyboardIcon={<CalendarToday />}

            format='dd.MM.yy'
            mask={[
                /\d/, /\d/, '.',
                /\d/, /\d/, '.',
                /\d/, /\d/,
            ]}
        />
    );
};

DateInput.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.string,

    margin: PropTypes.string.isRequired,
    className: PropTypes.string,
};

export default DateInput;
