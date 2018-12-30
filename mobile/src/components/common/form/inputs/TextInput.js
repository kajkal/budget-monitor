import React from 'react';
import { Input, Item, Label, Text } from 'native-base';
import PropTypes from 'prop-types';
import { negativeColor } from '../../../../config/theme';


const TextInput = ({ label, value, onChange, error, autoFocus }) => {
    return (
        <React.Fragment>
            <Item
                floatingLabel
                error={error !== undefined}
            >

                <Label>{label}</Label>

                <Input
                    value={value}
                    onChangeText={onChange}
                    autoFocus={autoFocus}
                />

            </Item>

            {
                error && (
                    <Text style={{ margin: 0, marginLeft: 16, color: negativeColor }}>
                        {error}
                    </Text>
                )
            }
        </React.Fragment>
    );
};


TextInput.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.string,
    autoFocus: PropTypes.bool,
};

TextInput.defaultProps = {
    autoFocus: false,
};

export default TextInput;
