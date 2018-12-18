import React from 'react';
import PropTypes from 'prop-types';
import { DateTimePicker } from 'material-ui-pickers';
import { CalendarToday, KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';


const DateTimeInput = ({ name, label, onChange, error, ...rest }) => {
    return (
        <DateTimePicker
            name={name}
            label={label}

            onChange={date => onChange(date.toISO())}

            error={error !== undefined}
            helperText={error}

            {...rest}

            ampm={false}
            keyboard={true}
            autoOk={true}
            showTabs={false}

            leftArrowIcon={<KeyboardArrowLeft />}
            rightArrowIcon={<KeyboardArrowRight />}
            keyboardIcon={<CalendarToday />}

            format="dd.MM.yyyy HH:mm"
            mask={[
                /\d/, /\d/, '.',
                /\d/, /\d/, '.',
                /\d/, /\d/, /\d/, /\d/, ' ',
                /\d/, /\d/, ':', /\d/, /\d/,
            ]}
        />
    );
};

DateTimeInput.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.string,

    autoFocus: PropTypes.bool.isRequired,
    margin: PropTypes.string.isRequired,
    className: PropTypes.string,
};

export default DateTimeInput;
