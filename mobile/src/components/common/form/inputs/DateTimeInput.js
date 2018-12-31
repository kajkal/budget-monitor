import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input, Item, Label, Text } from 'native-base';
import { negativeColor } from '../../../../config/theme';
import { DateTime } from 'luxon';
import DateTimePicker from 'react-native-modal-datetime-picker';


class DateTimeInput extends PureComponent {
    state = {
        open: false,
    };

    handleOpenPicker = () => {
        this.setState({ open: true });
    };

    handleClosePicker = () => {
        this.setState({ open: false });
    };

    handleConfirm = date => {
        this.handleClosePicker();
        const { onChange } = this.props;
        const isoDate = DateTime.fromJSDate(date).toISO();
        onChange(isoDate);
    };

    render() {
        const { open } = this.state;
        const { label, date, error } = this.props;
        const formattedDate = DateTime.fromISO(date).toFormat('dd.MM.yyyy HH:mm');

        return (
            <React.Fragment>
                <Item
                    floatingLabel
                >

                    <Label>{label}</Label>

                    <Input
                        value={formattedDate}
                        onFocus={this.handleOpenPicker}
                        onPress={this.handleOpenPicker}
                    />

                </Item>

                {
                    error && (
                        <Text style={{ margin: 0, marginLeft: 16, color: negativeColor }}>
                            {error}
                        </Text>
                    )
                }

                {
                    open && (
                        <DateTimePicker
                            mode='datetime'
                            isVisible={open}
                            is24Hour={true}
                            onConfirm={this.handleConfirm}
                            onCancel={this.handleClosePicker}
                        />
                    )
                }

            </React.Fragment>
        );
    }
}

DateTimeInput.propTypes = {
    label: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.string,
};

export default DateTimeInput;
