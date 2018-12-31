import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { categoryShape, entryShape, lodashPathShape } from '../../config/propTypesCommon';
import Joi from 'joi-browser';
import { Button, Content, Footer, FooterTab, Form, Text } from 'native-base';
import TextInput from '../common/form/inputs/TextInput';
import { allAreTruthy } from '../loading/LoadingScreen';
import LoadingScreen from '../loading/LoadingScreen';
import { translateErrorMessage } from '../../services/errorMessageService';
import CategorySelect from '../common/form/inputs/CategorySelect';
import { getCategoriesByType, getCategoryByIdCategory } from '../../services/entities-services/categoryService';
import _ from 'lodash';
import DateTimeInput from '../common/form/inputs/DateTimeInput';
import { DateTime } from 'luxon';
import {View} from 'react-native';
import alertService from '../../services/alertService';
import { addEntry, updateEntry } from '../../services/entities-services/entryService';


class EntryForm extends PureComponent {
    state = {
        requestSend: false,
        data: {
            value: '',
            description: '',
            date: '',
            category: null,
            subEntries: [],
        },
        errors: {},
    };

    schema = {
        value: Joi.number()
            .required()
            .positive()
            .max(1000000)
            .precision(2)
            .label('Value'),
        description: Joi.string()
            .required()
            .label('Description'),
    };


    componentDidMount() {
        const data = { ...this.state.data };
        const { entry } = this.props;

        if (entry) {
            data.value = (Math.abs(entry.value / 100)).toString();
            data.description = entry.description;
            data.date = DateTime.fromMillis(entry.date).toISO();
            data.category = getCategoryByIdCategory(entry.idCategory) || null;
            data.subEntries = entry.subEntries.map(subEntry => ({
                value: (Math.abs(subEntry.value / 100)).toString(),
                description: subEntry.description,
                category: getCategoryByIdCategory(subEntry.idCategory) || null,
            }));
        } else {
            data.date = DateTime.local().toISO();
        }
        this.setState({ data });
    }

    handleClose = () => {
        this.props.navigation.push('Home', {
            fetchRecentEntries: true
        });
    };

    handleSubmit = async () => {
        const { data } = this.state;
        const { entry, type } = this.props;
        try {
            if (entry) {
                await updateEntry(entry.idEntry, data, type);
                alertService.success('Entry successfully updated.');
                this.handleClose();
            } else {
                await addEntry(data, type);
                alertService.success('Entry successfully added.');
                this.handleClose();
            }
        } catch (e) {
            if (e.response && [400, 401].includes(e.response.status)) {
                const errors = translateErrorMessage(e.response.data.message);
                this.setState({ errors, requestSend: false });
            }
        }
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

    handleSubEntryChange = path => value => {
        const errors = { ...this.state.errors };
        const errorMessage = this.validateProperty(_.last(path), value);
        if (errorMessage) _.set(errors, path, errorMessage);
        else _.unset(errors, path);

        const data = { ...this.state.data };
        _.set(data, path, value);
        this.setState({ data, errors });
    };

    componentDidUpdate() {
        const { selectedCategoryData, onFinishProcessingSelectedCategoryData } = this.props;

        if (selectedCategoryData) {
            const { path: newPath, idCategory: newIdCategory } = selectedCategoryData;

            if (newPath && newIdCategory) {

                const data = { ...this.state.data };
                const currentCategory = _.get(data, newPath);
                const currentCategoryId = (currentCategory && currentCategory.idCategory) || null;

                if (currentCategoryId !== newIdCategory) {
                    const category = getCategoryByIdCategory(newIdCategory);
                    this.setState({ data: _.set(data, newPath, category) });
                }
            }
            onFinishProcessingSelectedCategoryData();
        }
    }

    handleAddSubEntry = () => {
        const data = { ...this.state.data };
        data.subEntries.push({
            value: '',
            description: '',
            category: data.category,
        });
        this.setState({ data });
    };

    renderSubEntry = (subEntry, index, rootCategory) => {
        const { data, errors } = this.state;
        const currentRootCategory = data.category || rootCategory;

        const path = ['subEntries', index];
        return (
            <React.Fragment key={index}>
                <View style={{ display: 'flex', flexDirection: 'row' }}>
                    <View style={{ flexBasis: '30%' }}>
                        <TextInput
                            label='Value'
                            value={_.get(data, [...path, 'value'])}
                            onChange={this.handleSubEntryChange([...path, 'value'])}
                            error={_.get(errors, [...path, 'value'])}
                            autoFocus={true}
                        />
                    </View>
                    <View style={{ flexBasis: '70%' }}>
                        <CategorySelect
                            path={[...path, 'category']}
                            label='Category'
                            category={_.get(data, [...path, 'category'])}
                            rootCategory={currentRootCategory}
                            navigation={this.props.navigation}
                        />
                    </View>
                </View>

                <TextInput
                    label='Description'
                    value={_.get(data, [...path, 'description'])}
                    onChange={this.handleSubEntryChange([...path, 'description'])}
                    error={_.get(errors, [...path, 'description'])}
                />
            </React.Fragment>
        );
    };

    render() {
        const { requestSend } = this.state;
        const { type, entry, rootCategory, navigation } = this.props;
        const { value, description, date, category, subEntries } = this.state.data;
        const { value: valueErr, description: descriptionErr, date: dateErr } = this.state.errors;

        const currentRootCategory = getCategoriesByType(rootCategory, type);

        if (allAreTruthy(requestSend)) return <LoadingScreen />;
        return (
            <React.Fragment>

                <Content>
                    <Form>

                        <TextInput
                            label='Value'
                            value={value}
                            onChange={this.handleChange('value')}
                            error={valueErr}
                            autoFocus={true}
                        />

                        <TextInput
                            label='Description'
                            value={description}
                            onChange={this.handleChange('description')}
                            error={descriptionErr}
                        />

                        <DateTimeInput
                            label='Date'
                            date={date}
                            onChange={this.handleChange('date')}
                            error={dateErr}
                        />

                        <CategorySelect
                            path={['category']}
                            label='Category'
                            category={category}
                            rootCategory={currentRootCategory}
                            navigation={navigation}
                        />

                        <View style={{ padding: 12 }}>
                            {subEntries.map((subEntry, index) => this.renderSubEntry(subEntry, index, rootCategory))}
                            <Button full small onPress={this.handleAddSubEntry}>
                                <Text>Add sub entry</Text>
                            </Button>
                        </View>

                    </Form>
                </Content>

                <Footer>
                    <FooterTab>

                        <Button
                            full={true}
                            onPress={this.handleSubmit}
                        >
                            <Text>{entry ? 'Edit' : 'Add'}</Text>
                        </Button>

                    </FooterTab>
                </Footer>

            </React.Fragment>
        );
    }
}

EntryForm.propTypes = {
    type: PropTypes.oneOf(['expense', 'income']).isRequired,
    currency: PropTypes.string.isRequired,
    rootCategory: categoryShape.isRequired,
    entry: entryShape,
    selectedCategoryData: PropTypes.shape({
        idCategory: PropTypes.number.isRequired,
        path: lodashPathShape.isRequired,
    }),
    onFinishProcessingSelectedCategoryData: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    navigation: PropTypes.shape({
        navigate: PropTypes.func.isRequired,
    }).isRequired,
};

export default EntryForm;
