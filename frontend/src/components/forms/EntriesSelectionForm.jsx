import React from 'react';
import PropTypes from 'prop-types';
import Joi from 'joi-browser';
import { DateTime } from 'luxon';
import Form from '../common/forms/Form';
import CategoryCheckboxList from '../common/lists/CategoryCheckboxList';
import { categoryShape } from '../../config/propTypesCommon';
import { getCategoriesIds } from '../../services/entities-services/categoryService';


class EntriesSelectionForm extends Form {
    state = {
        data: {
            from: '',
            to: '',
        },
        errors: {},
    };

    schema = {
        from: Joi.date()
            .required()
            .min('1-1-2010')
            .label('From'),
        to: Joi.date()
            .required()
            .min('1-1-2010')
            .label('To'),
    };

    componentDidMount() {
        const data = { ...this.state.data };

        const now = DateTime.local();
        data.from = now.minus({ months: 1 }).toISO();
        data.to = now.plus({days: 1}).toISO();

        const { rootCategory, selectedCategories, onSelectionSpecChange } = this.props;
        if (selectedCategories.length === 0) {
            console.log('EntriesSelectionForm set default selected categories');
            const defaultSelectedCategories = [];
            rootCategory.subCategories[1].subCategories.forEach(c => defaultSelectedCategories.push(c));
            onSelectionSpecChange(this.getSelectionSpec(data.from, data.to, defaultSelectedCategories));
        }

        this.setState({ data });
    }

    extendedOnInputChange = (_, data, errors) => {
        const { from, to } = data;
        if (DateTime.fromISO(from) > DateTime.fromISO(to)) {
            errors.from = '';
            errors.to = 'Should be after \'From\' date.';
        } else {
            delete errors.from;
            delete errors.to;
            const getSelectionSpec = this.getSelectionSpec(from, to, this.props.selectedCategories);
            this.props.onSelectionSpecChange(getSelectionSpec);
        }
    };

    getSelectionSpec = (fromISO, toISO, selectedCategories) => {
        return {
            from: DateTime.fromISO(fromISO),
            to: DateTime.fromISO(toISO),
            selectedCategories: selectedCategories,
            selectedCategoriesIds: getCategoriesIds(selectedCategories),
        };
    };

    handleSelectedCategoriesChange = selectedCategories => {
        const { from, to} = this.state.data;
        const selectionSpec = this.getSelectionSpec(from, to, selectedCategories);
        this.props.onSelectionSpecChange(selectionSpec);
        this.setState({ selectedCategories });
    };

    doSubmit = () => null;

    render() {
        const { rootCategory, expandedCategories, selectedCategories, onCategoryExpandToggle } = this.props;

        return (
            <form className='selection-entries-form' autoComplete='on' onKeyDown={this.onEnterDown}>
                {this.renderDateInput(['from'], 'From', {}, { className: 'from-input' })}
                {this.renderDateInput(['to'], 'To', {}, { className: 'to-input' })}
                <CategoryCheckboxList
                    expandedCategories={expandedCategories}
                    selectedCategories={selectedCategories}
                    onCategoryExpandToggle={onCategoryExpandToggle}
                    onSelectedCategoriesChange={this.handleSelectedCategoriesChange}

                    rootCategory={rootCategory}
                    className='categories-input'
                    dense={true}
                />
            </form>
        );
    }
}

EntriesSelectionForm.propTypes = {
    rootCategory: categoryShape.isRequired,
    expandedCategories: PropTypes.arrayOf(categoryShape).isRequired,
    selectedCategories: PropTypes.arrayOf(categoryShape).isRequired,
    onCategoryExpandToggle: PropTypes.func.isRequired,
    onSelectionSpecChange: PropTypes.func.isRequired,
};

export default EntriesSelectionForm;
