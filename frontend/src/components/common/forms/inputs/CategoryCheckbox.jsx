import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Checkbox from '@material-ui/core/es/Checkbox/Checkbox';
import { categoryShape } from '../../../../config/propTypesCommon';


class CategoryCheckbox extends PureComponent {

    isOppositeCategorySelected = (category, selectedCategories) => {
        return selectedCategories
            .map(c => c.path)
            .filter(([_, root]) => (category.path[1] !== root && category.idCategory !== root))
            .length > 0;
    };
    isCategorySelected = (category, selectedCategories) => {
        return selectedCategories.includes(category);
    };
    isCategoryChildOfSelectedCategory = (category, selectedCategories) => {
        return selectedCategories
            .map(c => c.idCategory)
            .filter(id => category.path.includes(id))
            .length > 0;
    };
    isCategoryParentOfSelectedCategory = (category, selectedCategories) => {
        return selectedCategories
            .map(c => c.path)
            .filter(path => path.includes(category.idCategory))
            .length > 0;
    };
    isCategoryRootCategory = (category) => {
        return [2, 3].includes(category.idCategory);
    };
    getSelectedSubCategoriesCount = (category, selectedCategories) => {
        return category.subCategories
            .filter(c => selectedCategories.includes(c))
            .length;
    };
    isAllSubCategoriesSelected = (category, selectedSubCategoriesCount) => {
        return selectedSubCategoriesCount > 0 && category.subCategories.length === selectedSubCategoriesCount;
    };

    getCheckboxProps = () => {
        const { category, selectedCategories } = this.props;
        const props = {
            onChange: (event, checked) => this.handleCheckboxChange(category, checked),
            color: 'default',
            checked: false,
        };

        if (this.isOppositeCategorySelected(category, selectedCategories)) {
            props.disabled = true;
            return props;
        }

        if (this.isCategorySelected(category, selectedCategories)) {
            props.color = 'primary';
            props.checked = true;
            return props;
        }

        if (this.isCategoryChildOfSelectedCategory(category, selectedCategories)) {
            props.checked = true;
            props.disabled = true;
            return props;
        }

        const selectedSubCategoriesCount = this.getSelectedSubCategoriesCount(category, selectedCategories);

        if (this.isCategoryRootCategory(category)) {
            props.onChange = (event, checked) => this.handleRootCheckboxChange(category, checked);
        }

        if (this.isAllSubCategoriesSelected(category, selectedSubCategoriesCount)) {
            props.checked = true;
            return props;
        }

        if (this.isCategoryParentOfSelectedCategory(category, selectedCategories)) {
            props.indeterminate = true;
        }

        return props;
    };


    handleCheckboxChange = (category, checked) => {
        const { selectedCategories: currentSelectedCategories, onCheckboxChange } = this.props;
        const selectedCategories = !checked ?
            currentSelectedCategories.filter(c => c.idCategory !== category.idCategory) :
            [...currentSelectedCategories, category];
        const newSelectedCategories = selectedCategories.filter(({ path }) => !path.includes(category.idCategory));
        onCheckboxChange(newSelectedCategories);
    };

    handleRootCheckboxChange = (rootCategory, checked) => {
        const { onCheckboxChange } = this.props;
        const newSelectedCategories = checked ? rootCategory.subCategories : [];
        onCheckboxChange(newSelectedCategories);
    };


    render() {
        return <Checkbox {...this.getCheckboxProps()} />;
    }
}

CategoryCheckbox.propTypes = {
    category: categoryShape.isRequired,
    selectedCategories: PropTypes.arrayOf(categoryShape).isRequired,
    onCheckboxChange: PropTypes.func.isRequired,
};

export default CategoryCheckbox;
