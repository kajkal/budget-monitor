import React, { PureComponent } from 'react';
import { Icon, Input, Item, Label, Text } from 'native-base';
import PropTypes from 'prop-types';
import { negativeColor, neutralColor } from '../../../../config/theme';


class PasswordInput extends PureComponent {
    state = {
        showPassword: false,
    };

    handleClickShowPassword = () => {
        this.setState(state => ({ showPassword: !state.showPassword }));
    };

    render() {
        const { showPassword } = this.state;
        const { label, value, onChange, error, autoFocus } = this.props;
        const iconName = showPassword ? 'visibility-off' : 'visibility';

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
                        secureTextEntry={!showPassword}
                    />

                    <Icon
                        name={iconName}
                        type='MaterialIcons'
                        style={{ color: neutralColor }}
                        onPress={this.handleClickShowPassword}
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
    }
}


PasswordInput.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.string,
    autoFocus: PropTypes.bool,
};

PasswordInput.defaultProps = {
    autoFocus: false,
};

export default PasswordInput;
