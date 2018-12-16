import React, { PureComponent } from 'react';
import Joi from 'joi-browser';
import _ from 'lodash';
import Button from '@material-ui/core/Button/Button';
import Tooltip from '@material-ui/core/Tooltip/Tooltip';
import IconButton from '@material-ui/core/IconButton/IconButton';
import TextInput from './inputs/TextInput';
import PasswordInput from './inputs/PasswordInput';
import SelectInput from './inputs/SelectInput';
import CurrencyInput from './inputs/CurrencyInput';
import DateTimeInput from './inputs/DateTimeInput';
import { formInputMargin } from '../../../config/theme';


class Form extends PureComponent {
    state = {
        data: {},
        errors: {},
    };

    validateProperty = (name, value) => {
        const obj = { [name]: value };
        const schema = { [name]: this.schema[name] };
        const { error } = Joi.validate(obj, schema);
        return error ? error.details[0].message : null;
    };

    handleChange = path => value => {
        let errors = { ...this.state.errors };
        const errorMessage = this.validateProperty(_.last(path), value);

        if (errorMessage) errors = _.set(errors, path, errorMessage);
        else _.unset(errors, path);

        let data = { ...this.state.data };
        data = _.set(data, path, value);
        this.setState({ data, errors });
    };

    validate = () => {
        const validateLevel = (root) => {
            const errors = {};

            _.forOwn(root, (value, key) => {
                if (_.isObject(value)) {
                    const subObjectErrors = validateLevel(value, [key]);
                    if (subObjectErrors) errors[key] = subObjectErrors;
                } else {
                    const errorMessage = this.validateProperty(key, value);
                    if (errorMessage) errors[key] = errorMessage;
                }
            });

            return _.isEmpty(errors) ? null : errors;
        };

        const errors = validateLevel(this.state.data);
        // console.log('validateAll returns: ', errors);
        // console.log('\n\n');
        return errors;
    };

    handleSubmit = e => {
        e.preventDefault();

        const errors = this.validate();
        this.setState({ errors: errors || {} });
        if (errors) return;

        this.doSubmit();
    };

    renderSubmitButton(label) {
        const renderButton = (disabled = false) => (
            <Button disabled={disabled} type='submit' color='secondary' className='submit-button'>
                {label}
            </Button>
        );

        const disabled = this.validate() !== null;
        if (disabled) {
            return (
                <Tooltip title='First, you must fill out this form' enterDelay={500} leaveDelay={200}>
                    <div>
                        {renderButton(true)}
                    </div>
                </Tooltip>
            );
        }
        else return renderButton();
    }

    renderCancelButton(onClick) {
        return (
            <Button color='secondary' className='cancel-button' onClick={onClick}>
                Cancel
            </Button>
        );
    }

    renderIconButton(icon, onClick, tooltip, className) {
        return (
            <Tooltip title={tooltip} enterDelay={500} leaveDelay={200}>
                <IconButton className={className} onClick={onClick}>
                    {icon}
                </IconButton>
            </Tooltip>
        )
    }

    _getInfo(path, value, error) {
        // console.log('path: ', path);
        // console.log('    data: ', this.state.data);
        // console.log('    error: ', this.state.error);
        // console.log(`value: '${JSON.stringify(value)}', error: '${JSON.stringify(error)}'`);
        // console.log('--------------------------------------------------------------------------------');
    }

    renderTextInput(path, label, className, focus = false, margin = formInputMargin) {
        const value = _.get(this.state.data, path);
        const error = _.get(this.state.errors, path);

        this._getInfo(path, value, error);

        return (
            <TextInput
                name={_.last(path)}
                label={label}
                value={value}
                onChange={this.handleChange(path)}
                error={error}
                className={className}
                autoFocus={focus}
                margin={margin}
            />
        );
    }

    renderPasswordInput(path, label, className, focus = false, margin = formInputMargin) {
        const value = _.get(this.state.data, path);
        const error = _.get(this.state.errors, path);

        this._getInfo(path, value, error);

        return (
            <PasswordInput
                name={_.last(path)}
                label={label}
                value={value}
                onChange={this.handleChange(path)}
                className={className}
                error={error}
                autoFocus={focus}
                margin={margin}
            />
        );
    }

    renderSelectInput(path, label, options, className, focus = false, margin = formInputMargin) {
        const value = _.get(this.state.data, path);
        const error = _.get(this.state.errors, path);

        this._getInfo(path, value, error);

        return (
            <SelectInput
                name={_.last(path)}
                label={label}
                options={options}
                value={value}
                onChange={this.handleChange(path)}
                className={className}
                error={error}
                autoFocus={focus}
                margin={margin}
            />
        );
    }

    renderCurrencyInput(path, label, currency, className, focus = false, margin = formInputMargin) {
        const value = _.get(this.state.data, path);
        const error = _.get(this.state.errors, path);

        this._getInfo(path, value, error);

        return (
            <CurrencyInput
                name={_.last(path)}
                label={label}
                value={value}
                onChange={this.handleChange(path)}
                error={error}
                className={className}
                autoFocus={focus}
                currency={currency}
                margin={margin}
            />
        );
    }

    renderDateTimeInput(path, label, className, focus = false, margin = formInputMargin) {
        const value = _.get(this.state.data, path);
        const error = _.get(this.state.errors, path);

        this._getInfo(path, value, error);

        return (
            <DateTimeInput
                name={_.last(path)}
                label={label}
                value={value}
                onChange={this.handleChange(path)}
                className={className}
                error={error}
                autoFocus={focus}
                margin={margin}
            />
        );
    }

}

export default Form;
