import React, { PureComponent } from 'react';
import Joi from 'joi-browser';
import Button from '@material-ui/core/Button/Button';
import TextInput from './inputs/TextInput';
import PasswordInput from './inputs/PasswordInput';
import _ from 'lodash';
import SelectInput from './inputs/SelectInput';
import CurrencyInput from './inputs/CurrencyInput';
import DateTimeInput from './inputs/DateTimeInput';
import Tooltip from '@material-ui/core/Tooltip/Tooltip';


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
        const deleteError = (errors, path) => {
            _.unset(errors, path);
            _.forOwn(errors, (value, key) => {
                if (_.isEmpty(value)) _.unset(errors, key);
            });
            return errors;
        };

        let errors = { ...this.state.errors };
        const errorMessage = this.validateProperty(_.last(path), value);

        if (errorMessage) errors = _.set(errors, path, errorMessage);
        else errors = deleteError(errors, path);

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
        console.log('validateAll returns: ', errors);
        console.log('\n\n');
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

    renderCancelButton() {
        return (
            <Button color='secondary' className='cancel-button'>
                Cancel
            </Button>
        );
    }

    renderTextInput(path, label, className, focus = false) {
        console.log('path: ', path);
        console.log('    data: ', this.state.data);
        console.log('    error: ', this.state.error);
        const value = _.get(this.state.data, path);
        const error = _.get(this.state.errors, path);

        console.log(`value: '${JSON.stringify(value)}', error: '${JSON.stringify(error)}'`);
        console.log('--------------------------------------------------------------------------------');

        return (
            <TextInput
                name={_.last(path)}
                label={label}
                value={value}
                onChange={this.handleChange(path)}
                error={error}
                className={className}
                autoFocus={focus}
            />
        );
    }

    renderPasswordInput(path, label, className, focus = false) {
        console.log('path: ', path);
        console.log('    data: ', this.state.data);
        console.log('    error: ', this.state.error);
        const value = _.get(this.state.data, path);
        const error = _.get(this.state.errors, path);

        console.log(`value: '${JSON.stringify(value)}', error: '${JSON.stringify(error)}'`);
        console.log('--------------------------------------------------------------------------------');

        return (
            <PasswordInput
                name={_.last(path)}
                label={label}
                value={value}
                onChange={this.handleChange(path)}
                className={className}
                error={error}
                autoFocus={focus}
            />
        );
    }

    renderSelectInput(path, label, options, className, focus = false) {
        console.log('path: ', path);
        console.log('    data: ', this.state.data);
        console.log('    error: ', this.state.error);
        const value = _.get(this.state.data, path);
        const error = _.get(this.state.errors, path);

        console.log(`value: '${JSON.stringify(value)}', error: '${JSON.stringify(error)}'`);
        console.log('--------------------------------------------------------------------------------');

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
            />
        );
    }

    renderCurrencyInput(path, label, currency, className, focus = false) {
        console.log('path: ', path);
        console.log('    data: ', this.state.data);
        console.log('    error: ', this.state.error);
        const value = _.get(this.state.data, path);
        const error = _.get(this.state.errors, path);

        console.log(`value: '${JSON.stringify(value)}', error: '${JSON.stringify(error)}'`);
        console.log('--------------------------------------------------------------------------------');

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
            />
        );
    }

    renderDateTimeInput(path, label, className, focus = false) {
        console.log('path: ', path);
        console.log('    data: ', this.state.data);
        console.log('    error: ', this.state.error);
        const value = _.get(this.state.data, path);
        const error = _.get(this.state.errors, path);

        console.log(`value: '${JSON.stringify(value)}', error: '${JSON.stringify(error)}'`);
        console.log('--------------------------------------------------------------------------------');

        return (
            <DateTimeInput
                name={_.last(path)}
                label={label}
                value={value}
                onChange={this.handleChange(path)}
                className={className}
                error={error}
                autoFocus={focus}
            />
        );
    }

}

export default Form;
