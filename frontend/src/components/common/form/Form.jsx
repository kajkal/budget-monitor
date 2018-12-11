import React, { Component } from 'react';
import Joi from 'joi-browser';
import Button from '@material-ui/core/Button/Button';
import TextInput from './inputs/TextInput';
import PasswordInput from './inputs/PasswordInput';
import SelectInput from './inputs/SelectInput';
import CurrencyInput from './inputs/CurrencyInput';


class Form extends Component {
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

    handleChange = name => value => {
        const errors = { ...this.state.errors };
        const errorMessage = this.validateProperty(name, value);
        if (errorMessage) errors[name] = errorMessage;
        else delete errors[name];

        const data = { ...this.state.data };
        data[name] = value;
        this.setState({ data, errors });
    };

    validate = () => {
        const options = { abortEarly: false };
        const { error } = Joi.validate(this.state.data, this.schema, options);
        if (!error) return null;

        const errors = {};
        for (let item of error.details) errors[item.path[0]] = item.message;
        return errors;
    };

    handleSubmit = e => {
        e.preventDefault();

        const errors = this.validate();
        this.setState({ errors: errors || {} });
        if (errors) return;

        this.doSubmit();
    };

    renderButton(label) {
        const disabled = this.validate() !== null;
        return (
            <Button disabled={disabled} type='submit' color="secondary" className='submit-button'>
                {label}
            </Button>
        );
    }

    renderTextInput(name, label, focus = false) {
        const { data, errors } = this.state;

        return (
            <TextInput
                name={name}
                label={label}
                value={data[name]}
                onChange={this.handleChange(name)}
                error={errors[name]}
                autoFocus={focus}
            />
        );
    }

    renderCurrencyInput(name, label, currency, focus = false) {
        const { data, errors } = this.state;

        return (
            <CurrencyInput
                name={name}
                label={label}
                value={data[name]}
                onChange={this.handleChange(name)}
                error={errors[name]}
                autoFocus={focus}
                currency={currency}
            />
        );
    }

    renderSelectInput(name, label, options, focus = false) {
        const { data, errors } = this.state;

        return (
            <SelectInput
                name={name}
                label={label}
                options={options}
                value={data[name]}
                onChange={this.handleChange(name)}
                error={errors[name]}
                autoFocus={focus}
            />
        );
    }

    renderPasswordInput(name, label, focus = false) {
        const { data, errors } = this.state;

        return (
            <PasswordInput
                name={name}
                label={label}
                value={data[name]}
                onChange={this.handleChange(name)}
                error={errors[name]}
                autoFocus={focus}
            />
        );
    }

}

export default Form;
