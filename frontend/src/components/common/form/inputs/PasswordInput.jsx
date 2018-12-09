import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField/TextField';
import PropTypes from 'prop-types';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import { formInputFullWidth, formInputMargin } from '../../../../config/theme';


class PasswordInput extends Component {
    state = {
        showPassword: false,
    };

    handleClickShowPassword = () => {
        this.setState(state => ({ showPassword: !state.showPassword }));
    };

    render() {
        const { name, label, error, ...rest } = this.props;
        return (
            <TextField
                type={this.state.showPassword ? 'text' : 'password'}
                autoComplete={name}

                name={name}
                label={label}

                error={error !== undefined}
                helperText={error}

                fullWidth={formInputFullWidth}
                margin={formInputMargin}

                {...rest}

                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="Toggle password visibility"
                                onClick={this.handleClickShowPassword}
                            >
                                {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
        );
    }
}

PasswordInput.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.string
};

export default PasswordInput;
