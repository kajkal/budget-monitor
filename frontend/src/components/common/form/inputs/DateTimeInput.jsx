import React from 'react';
import PropTypes from 'prop-types';
import { DateTimePicker } from 'material-ui-pickers';
import { CalendarToday, KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import { formInputFullWidth, formInputMargin } from '../../../../config/theme';


const DateTimeInput = ({ name, label, onChange, error, ...rest }) => {
    return (
        <DateTimePicker
            name={name}
            label={label}

            onChange={date => onChange(date.toISO())}

            error={error !== undefined}
            helperText={error}

            fullWidth={formInputFullWidth}
            margin={formInputMargin}

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
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    className: PropTypes.string,
    error: PropTypes.string,
};

export default DateTimeInput;
