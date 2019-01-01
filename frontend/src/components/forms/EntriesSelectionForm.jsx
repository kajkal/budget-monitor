import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { DateTime } from 'luxon';
import CategoryCheckboxList from '../common/lists/CategoryCheckboxList';
import { categoryShape } from '../../config/propTypesCommon';
import { getCategoriesIds } from '../../services/entities-services/categoryService';
import DateInput from '../common/forms/inputs/DateInput';
import { formInputMargin } from '../../config/theme';


class EntriesSelectionForm extends PureComponent {
    state = {
        data: {
            from: '',
            to: '',
        },
        errors: {},
    };

    componentDidMount() {
        const data = { ...this.state.data };

        const now = DateTime.local();
        data.from = now.minus({ months: 1 }).toISO();
        data.to = now.plus({days: 1}).toISO();

        const { rootCategory, selectedCategories, onSelectionSpecChange } = this.props;
        if (selectedCategories.length === 0) {
            const defaultSelectedCategories = [];
            rootCategory.subCategories[1].subCategories.forEach(c => defaultSelectedCategories.push(c));
            onSelectionSpecChange(this.getSelectionSpec(data.from, data.to, defaultSelectedCategories));
        }

        this.setState({ data });
    }

    getSelectionSpec = (fromISO, toISO, selectedCategories) => {
        const categoriesType = selectedCategories.length > 0 ? (selectedCategories[0].path[1] === 2 ? 1 : -1) : 0;
        // -1 => expense categories selected
        // 0 => no category selected
        // 1 => income categories selected

        return {
            from: DateTime.fromISO(fromISO),
            to: DateTime.fromISO(toISO),
            selectedCategories: selectedCategories,
            selectedCategoriesType: categoriesType,
            selectedCategoriesIds: getCategoriesIds(selectedCategories),
        };
    };

    handleFromDateChange = newFrom => {
        const errors = { ...this.state.errors };
        const { to } = this.state.data;

        if (DateTime.fromISO(newFrom) > DateTime.fromISO(to)) {
            errors.from = 'Should be before \'To\' date.';
            errors.to = '';
        } else {
            delete errors.from;
            delete errors.to;
            const getSelectionSpec = this.getSelectionSpec(newFrom, to, this.props.selectedCategories);
            this.props.onSelectionSpecChange(getSelectionSpec);
        }
        this.setState({ data: { from: newFrom, to: to }, errors });
    };

    handleToDateChange = newTo => {
        const errors = { ...this.state.errors };
        const { from } = this.state.data;

        if (DateTime.fromISO(from) > DateTime.fromISO(newTo)) {
            errors.from = '';
            errors.to = 'Should be after \'From\' date.';
        } else {
            delete errors.from;
            delete errors.to;
            const getSelectionSpec = this.getSelectionSpec(from, newTo, this.props.selectedCategories);
            this.props.onSelectionSpecChange(getSelectionSpec);
        }
        this.setState({ data: { from: from, to: newTo }, errors });
    };

    handleSelectedCategoriesChange = selectedCategories => {
        const { from, to} = this.state.data;
        const selectionSpec = this.getSelectionSpec(from, to, selectedCategories);
        this.props.onSelectionSpecChange(selectionSpec);
        this.setState({ selectedCategories });
    };

    render() {
        const { rootCategory, expandedCategories, selectedCategories, onCategoryExpandToggle } = this.props;
        const { from, to } = this.state.data;
        const { from: fromErrors, to: toErrors } = this.state.errors;

        return (
            <form className='selection-entries-form'>

                <DateInput
                    name='from'
                    label='From'
                    value={from}
                    onChange={this.handleFromDateChange}
                    className='from-input'
                    error={fromErrors}
                    margin={formInputMargin}
                />

                <DateInput
                    name='to'
                    label='To'
                    value={to}
                    onChange={this.handleToDateChange}
                    className='to-input'
                    error={toErrors}
                    margin={formInputMargin}
                />

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
