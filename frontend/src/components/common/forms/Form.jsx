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
import CategoryInput from './inputs/CategoryInput';
import DateInput from './inputs/DateInput';


class Form extends PureComponent {
    state = {
        data: {},
        errors: {},
    };

    validationIgnoreList = [];

    validateProperty = (name, value) => {
        const obj = { [name]: value };
        const schema = { [name]: this.schema[name] };
        const { error } = Joi.validate(obj, schema);
        return error ? error.details[0].message : null;
    };

    handleChange = path => value => {
        let errors = { ...this.state.errors };
        const errorMessage = this.validateProperty(_.last(path), value);

        if (errorMessage) _.set(errors, path, errorMessage);
        else _.unset(errors, path);

        let data = { ...this.state.data };
        _.set(data, path, value);

        this.extendedOnInputChange && this.extendedOnInputChange(path, data, errors);
        this.setState({ data, errors });
    };

    validate = () => {
        const validateLevel = (root) => {
            const errors = {};

            _.forOwn(root, (value, key) => {
                if (_.isObject(value) && !this.validationIgnoreList.includes(key)) {
                    const subObjectErrors = validateLevel(value);
                    if (subObjectErrors) errors[key] = subObjectErrors;
                } else {
                    const errorMessage = this.validateProperty(key, value);
                    if (errorMessage) errors[key] = errorMessage;
                }
            });

            return _.isEmpty(errors) ? null : errors;
        };

        return validateLevel(this.state.data);
    };

    handleSubmit = () => {
        const errors = this.validate();
        this.setState({ errors: errors || {} });
        if (errors) return;

        this.doSubmit();
    };

    onEnterDown = event => {
        if (event.key === 'Enter') {
            event.preventDefault();
            event.stopPropagation();
            if (this.validate() === null)
                this.doSubmit();
        }
    };

    renderSubmitButton(label) {
        const renderButton = (disabled = false) => (
            <Button disabled={disabled} color='primary' className='submit-button' onClick={this.handleSubmit}>
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
            <Button color='primary' className='cancel-button' onClick={onClick}>
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

    renderTextInput(path, label, inputDetails, inputOptions) {
        const value = _.get(this.state.data, path);
        const error = _.get(this.state.errors, path);

        // const {} = inputDetails;
        const {className, focus = false, margin = formInputMargin} = inputOptions;

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

    renderPasswordInput(path, label, inputDetails, inputOptions) {
        const value = _.get(this.state.data, path);
        const error = _.get(this.state.errors, path);

        // const {} = inputDetails;
        const {className, focus = false, margin = formInputMargin} = inputOptions;

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

    renderSelectInput(path, label, inputDetails, inputOptions) {
        const value = _.get(this.state.data, path);
        const error = _.get(this.state.errors, path);

        const { options } = inputDetails;
        const {className, focus = false, margin = formInputMargin} = inputOptions;

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

    renderCurrencyInput(path, label, inputDetails, inputOptions) {
        const value = _.get(this.state.data, path);
        const error = _.get(this.state.errors, path);

        const { currency } = inputDetails;
        const {className, focus = false, margin = formInputMargin} = inputOptions;

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

    renderDateTimeInput(path, label, inputDetails, inputOptions) {
        const value = _.get(this.state.data, path);
        const error = _.get(this.state.errors, path);

        // const {} = inputDetails;
        const {className, focus = false, margin = formInputMargin} = inputOptions;

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

    renderDateInput(path, label, inputDetails, inputOptions) {
        const value = _.get(this.state.data, path);
        const error = _.get(this.state.errors, path);

        // const {} = inputDetails;
        const {className, margin = formInputMargin} = inputOptions;

        this._getInfo(path, value, error);

        return (
            <DateInput
                name={_.last(path)}
                label={label}
                value={value}
                onChange={this.handleChange(path)}
                className={className}
                error={error}
                margin={margin}
            />
        );
    }

    renderCategoryInput(path, label, inputDetails, inputOptions) {
        const value = _.get(this.state.data, path); // whole category object
        const error = _.get(this.state.errors, path);

        const {rootCategory, onlySubCategories, header, categoryDisabled, resetDisabled } = inputDetails;
        const {className, focus = false, margin = formInputMargin} = inputOptions;

        this._getInfo(path, value, error);

        return (
            <CategoryInput
                name={_.last(path)}
                label={label}
                value={value}
                onChange={this.handleChange(path)}
                error={error}

                rootCategory={rootCategory}
                onlySubCategories={onlySubCategories}
                header={header}
                categoryDisabled={categoryDisabled}
                resetDisabled={resetDisabled}

                className={className}
                autoFocus={focus}
                margin={margin}
            />
        );
    }

}

export default Form;
